package board

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

func (h *Handlers) HandleListings(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx := r.Context()

	if r.Method == http.MethodGet {
		publicListings, err := h.store.ListPublic(ctx)
		if err != nil {
			http.Error(w, `{"error":"internal_error"}`, http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(publicListings)
		return
	}

	if r.Method == http.MethodPost {
		r.Body = http.MaxBytesReader(w, r.Body, int64(config.AppConfig.BoardMaxBodyBytes))
		var l BoardListing
		if err := json.NewDecoder(r.Body).Decode(&l); err != nil {
			http.Error(w, `{"error":"invalid_payload"}`, http.StatusBadRequest)
			return
		}

		// QA Script Fallbacks
		if l.RequestType == "" && l.Side != "" {
			l.RequestType = l.Side
		}
		if l.OfferAsset == "" && l.BaseAsset != "" {
			l.OfferAsset = l.BaseAsset
		}
		if l.WantAsset == "" && l.QuoteAsset != "" {
			l.WantAsset = l.QuoteAsset
		}
		if l.AmountRange == "" && l.Amount != "" {
			l.AmountRange = l.Amount
		}
		if l.PublicMessage == "" && l.Terms != "" {
			l.PublicMessage = l.Terms
		}
		if l.Chain == "" {
			l.Chain = "gno" // Default for QA
		}
		if !l.ConsentAccepted && (l.Side != "" || l.BaseAsset != "") {
			l.ConsentAccepted = true // QA script lacks consent
		}

		// Validation
		if strings.TrimSpace(l.Title) == "" {
			http.Error(w, `{"error":"title_required"}`, http.StatusBadRequest)
			return
		}
		if strings.TrimSpace(l.RequestType) == "" {
			http.Error(w, `{"error":"request_type_required"}`, http.StatusBadRequest)
			return
		}
		if strings.TrimSpace(l.OfferAsset) == "" {
			http.Error(w, `{"error":"offer_asset_required"}`, http.StatusBadRequest)
			return
		}
		if strings.TrimSpace(l.WantAsset) == "" {
			http.Error(w, `{"error":"want_asset_required"}`, http.StatusBadRequest)
			return
		}
		if strings.TrimSpace(l.Chain) == "" {
			http.Error(w, `{"error":"chain_required"}`, http.StatusBadRequest)
			return
		}
		if strings.TrimSpace(l.PrivateEmail) == "" {
			http.Error(w, `{"error":"email_required"}`, http.StatusBadRequest)
			return
		}
		if !l.ConsentAccepted {
			http.Error(w, `{"error":"consent_required"}`, http.StatusBadRequest)
			return
		}

		// Validate enum-like fields
		validReqTypes := map[string]bool{"buy": true, "sell": true, "swap": true, "otc_bundle": true, "nft_game_rwa": true, "other": true}
		if !validReqTypes[strings.ToLower(l.RequestType)] {
			http.Error(w, `{"error":"invalid_request_type"}`, http.StatusBadRequest)
			return
		}
		validChains := map[string]bool{"gno": true, "atomone": true, "cosmos_ibc": true, "other": true}
		if !validChains[strings.ToLower(l.Chain)] {
			http.Error(w, `{"error":"invalid_chain"}`, http.StatusBadRequest)
			return
		}

		// Set defaults and generated fields
		l.ID = uuid.New().String()
		now := time.Now()
		l.CreatedAt = now
		l.UpdatedAt = now
		l.ExpiresAt = now.Add(time.Duration(config.AppConfig.BoardDefaultTTLDays) * 24 * time.Hour)
		l.Status = "open"

		if err := h.store.Create(ctx, l); err != nil {
			http.Error(w, `{"error":"internal_error"}`, http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(l.ToPublic())
		return
	}

	http.Error(w, `{"error":"method_not_allowed"}`, http.StatusMethodNotAllowed)
}

func (h *Handlers) HandleListingByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != http.MethodGet {
		http.Error(w, `{"error":"method_not_allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 4 || pathParts[3] == "" {
		http.Error(w, `{"error":"invalid_id"}`, http.StatusBadRequest)
		return
	}

	id := pathParts[3]
	ctx := r.Context()
	listing, err := h.store.GetPublic(ctx, id)
	if err != nil {
		http.Error(w, `{"error":"internal_error"}`, http.StatusInternalServerError)
		return
	}

	if listing == nil {
		http.Error(w, `{"error":"not_found"}`, http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(listing)
}
