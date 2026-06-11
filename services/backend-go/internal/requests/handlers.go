package requests

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/tradewindow/backend-go/internal/config"
)

type Handlers struct {
	store Store
}

func NewHandlers(store Store) *Handlers {
	return &Handlers{
		store: store,
	}
}

func (h *Handlers) HandleDealRequests(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method_not_allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, int64(config.AppConfig.RequestsMaxBodyBytes))
	var req DealRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid_payload"}`, http.StatusBadRequest)
		return
	}

	// Validation
	if strings.TrimSpace(req.Name) == "" {
		http.Error(w, `{"error":"name_required"}`, http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(req.Email) == "" {
		http.Error(w, `{"error":"email_required"}`, http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(req.RequestType) == "" {
		http.Error(w, `{"error":"request_type_required"}`, http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(req.OfferAsset) == "" {
		http.Error(w, `{"error":"offer_asset_required"}`, http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(req.WantAsset) == "" {
		http.Error(w, `{"error":"want_asset_required"}`, http.StatusBadRequest)
		return
	}
	if strings.TrimSpace(req.Chain) == "" {
		http.Error(w, `{"error":"chain_required"}`, http.StatusBadRequest)
		return
	}
	if !req.ConsentAccepted {
		http.Error(w, `{"error":"consent_required"}`, http.StatusBadRequest)
		return
	}

	// Validate enum-like fields
	validReqTypes := map[string]bool{"buy": true, "sell": true, "swap": true, "otc_bundle": true, "nft_game_rwa": true, "other": true}
	if !validReqTypes[strings.ToLower(req.RequestType)] {
		http.Error(w, `{"error":"invalid_request_type"}`, http.StatusBadRequest)
		return
	}
	validChains := map[string]bool{"gno": true, "atomone": true, "cosmos_ibc": true, "other": true}
	if !validChains[strings.ToLower(req.Chain)] {
		http.Error(w, `{"error":"invalid_chain"}`, http.StatusBadRequest)
		return
	}

	// Set defaults and generated fields
	req.ID = uuid.New().String()
	req.CreatedAt = time.Now()
	req.Status = "open"

	if err := h.store.Create(ctx, req); err != nil {
		http.Error(w, `{"error":"internal_error"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok", "id": req.ID})
}
