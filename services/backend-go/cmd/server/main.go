package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/tradewindow/backend-go/internal/board"
	"github.com/tradewindow/backend-go/internal/config"
	"github.com/tradewindow/backend-go/internal/ws"
)

var upgrader websocket.Upgrader

func initUpgrader() {
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			// Allow empty origin (local dev/postman)
			if origin == "" {
				return true
			}
			
			// Allow localhost by default
			if strings.HasPrefix(origin, "http://localhost:") {
				return true
			}
			
			// Check configured allowed origins
			for _, allowed := range config.AppConfig.AllowedOrigins {
				if origin == allowed {
					return true
				}
			}
			
			log.Printf("Blocked origin: %s\n", origin)
			return false
		},
	}
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

	boardStorage := board.NewStorage(config.AppConfig.BoardStoragePath)
	boardHandlers := board.NewHandlers(boardStorage)

	corsMiddleware := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*") // simplified for board
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next(w, r)
		}
	}

	http.HandleFunc("/api/board/listings", corsMiddleware(boardHandlers.HandleListings))
	http.HandleFunc("/api/board/listings/", corsMiddleware(boardHandlers.HandleListingByID))

	http.HandleFunc("/rooms/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		
		pathParts := strings.Split(r.URL.Path, "/")
		if len(pathParts) < 3 || pathParts[2] == "" {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "invalid_room_id"})
			return
		}
		
		roomID := pathParts[2]
		room, exists := hub.GetRoom(roomID)
		
		if !exists {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "room_not_found"})
			return
		}
		
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(room)
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		wallet := r.URL.Query().Get("wallet")
		if strings.TrimSpace(wallet) == "" {
			http.Error(w, "wallet query param required", http.StatusUnauthorized)
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
