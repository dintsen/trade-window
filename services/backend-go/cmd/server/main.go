package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"unicode"

	"github.com/gorilla/websocket"
	"github.com/tradewindow/backend-go/internal/auth"
	"github.com/tradewindow/backend-go/internal/board"
	"github.com/tradewindow/backend-go/internal/config"
	"github.com/tradewindow/backend-go/internal/history"
	"github.com/tradewindow/backend-go/internal/requests"
	"github.com/tradewindow/backend-go/internal/storage"
	"github.com/tradewindow/backend-go/internal/ws"
)

var upgrader websocket.Upgrader

func initUpgrader() {
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			if isAllowedOrigin(origin) {
				return true
			}
			log.Printf("Blocked origin: %s\n", origin)
			return false
		},
	}
}

func isAllowedOrigin(origin string) bool {
	if strings.TrimSpace(origin) == "" {
		return false
	}
	for _, allowed := range config.AppConfig.AllowedOrigins {
		allowed = strings.TrimSpace(allowed)
		if allowed == "*" || origin == allowed {
			return true
		}
	}
	return false
}

func isValidWalletAddress(wallet string) bool {
	wallet = strings.TrimSpace(wallet)
	if len(wallet) < 6 || len(wallet) > 128 {
		return false
	}
	for _, r := range wallet {
		if unicode.IsLetter(r) || unicode.IsDigit(r) || r == '-' || r == '_' || r == ':' {
			continue
		}
		return false
	}
	return true
}

func main() {
	config.Init()
	initUpgrader()

	hub := ws.NewHub()
	go hub.Run()
	go hub.RunCleanup()

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "ok",
			"service": "trade-window-backend",
		})
	})

	var boardStore board.Store
	var requestsStore requests.Store
	var historyHandlers *history.Handlers

	if config.AppConfig.StorageDriver == "postgres" {
		if config.AppConfig.DatabaseURL == "" {
			log.Fatal("STORAGE_DRIVER is set to postgres but DATABASE_URL is missing")
		}
		ctx := context.Background()
		pool := storage.InitPostgresPool(ctx)
		defer pool.Close()

		log.Println("Using Postgres storage")

		// Run database migrations
		if err := storage.RunMigrations(ctx, pool); err != nil {
			log.Fatalf("Database migrations failed: %v", err)
		}

		boardStore = board.NewPostgresBoardStore(pool)
		requestsStore = requests.NewPostgresRequestStore(pool)
		
		historyStore := history.NewPostgresHistoryStore(pool)
		historyHandlers = history.NewHandlers(historyStore)
	} else {
		log.Println("Using JSONL MVP storage")
		boardStore = board.NewJSONLBoardStore(config.AppConfig.BoardStoragePath)
		requestsStore = requests.NewJSONLRequestStore(config.AppConfig.RequestsStoragePath)
		historyHandlers = history.NewHandlers(nil) // JSONL no-op
	}

	boardHandlers := board.NewHandlers(boardStore)
	requestsHandlers := requests.NewHandlers(requestsStore)

	corsMiddleware := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			allowedOrigin := ""

			if isAllowedOrigin(origin) {
				allowedOrigin = origin
			}

			if allowedOrigin != "" {
				w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
			} else {
				// Fallback to strict empty or * if you prefer, but strict is better
				w.Header().Set("Access-Control-Allow-Origin", "null")
			}

			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next(w, r)
		}
	}

	http.HandleFunc("/api/auth/nonce", corsMiddleware(auth.HandleNonce))
	http.HandleFunc("/api/auth/verify", corsMiddleware(auth.HandleVerify))

	http.HandleFunc("/api/board/listings", corsMiddleware(boardHandlers.HandleListings))
	http.HandleFunc("/api/board/listings/", corsMiddleware(boardHandlers.HandleListingByID))
	http.HandleFunc("/api/deal-requests", corsMiddleware(requestsHandlers.HandleDealRequests))
	http.HandleFunc("/api/me/trades", corsMiddleware(historyHandlers.HandleMyTrades))

	http.HandleFunc("/api/trade/rooms", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if r.Method == http.MethodPost {
			// Stub for POST /api/trade/rooms
			// Currently rooms are created via WS, but this satisfies the REST API requirement.
			w.WriteHeader(http.StatusNotImplemented)
			json.NewEncoder(w).Encode(map[string]string{"error": "use_websocket_for_creation"})
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))

	http.HandleFunc("/api/trade/rooms/", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		pathParts := strings.Split(r.URL.Path, "/")
		if len(pathParts) < 4 || pathParts[4] == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "invalid_room_id"})
			return
		}

		roomID := pathParts[4]
		room, exists := hub.GetRoom(roomID)

		if !exists {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "room_not_found"})
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(room)
	}))

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		wallet := r.URL.Query().Get("wallet")
		if !isValidWalletAddress(wallet) {
			http.Error(w, "valid wallet query param required", http.StatusUnauthorized)
			return
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		client := &ws.Client{
			Hub:     hub,
			Conn:    conn,
			Send:    make(chan []byte, 256),
			Address: wallet,
		}
		client.Hub.Register <- client

		go client.WritePump()
		go client.ReadPump()
	})

	addr := fmt.Sprintf(":%s", config.AppConfig.Port)
	log.Printf("WebSocket Server listening on %s", addr)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
