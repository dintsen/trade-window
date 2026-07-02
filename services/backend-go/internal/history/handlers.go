package history

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/tradewindow/backend-go/internal/config"
)

type Handlers struct {
	store Store
}

func NewHandlers(store Store) *Handlers {
	return &Handlers{store: store}
}

func (h *Handlers) HandleMyTrades(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodGet {
		http.Error(w, `{"error":"method_not_allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	wallet := r.URL.Query().Get("wallet")
	wallet = strings.TrimSpace(wallet)
	if wallet == "" {
		http.Error(w, `{"error":"wallet_required"}`, http.StatusBadRequest)
		return
	}

	// MVP Warning: This is NOT secure authentication.
	// We are trusting the ?wallet= param to filter for history.
	
	if config.AppConfig.StorageDriver != "postgres" {
		// MVP JSONL fallback (no history implementation for JSONL)
		json.NewEncoder(w).Encode([]HistoryItem{})
		return
	}

	history, err := h.store.GetHistoryByWallet(r.Context(), wallet)
	if err != nil {
		http.Error(w, `{"error":"internal_error"}`, http.StatusInternalServerError)
		return
	}

	if history == nil {
		history = []HistoryItem{}
	}

	json.NewEncoder(w).Encode(history)
}
