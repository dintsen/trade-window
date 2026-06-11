package rooms

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"time"
)

type TradeIntent struct {
	IntentID  string       `json:"intentId"`
	Version   string       `json:"version"`
	RoomID    string       `json:"roomId"`
	ChainID   string       `json:"chainId"`
	PartyA    string       `json:"partyA"`
	PartyB    string       `json:"partyB"`
	OfferA    []TradeAsset `json:"offerA"`
	OfferB    []TradeAsset `json:"offerB"`
	Fee       string       `json:"fee"`
	FeeToken  string       `json:"feeToken"`
	CreatedAt string       `json:"createdAt"`
	ExpiresAt string       `json:"expiresAt"`
	Nonce     string       `json:"nonce"`
	Status    string       `json:"status"`
}

func ComputeIntentHash(intent TradeIntent) string {
	b, _ := json.Marshal(intent)
	hash := sha256.Sum256(b)
	return "0x" + hex.EncodeToString(hash[:])
}

func (r *Room) GenerateIntent() TradeIntent {
	r.mu.Lock()
	defer r.mu.Unlock()

	intentID := r.ID + "-intent"
	return TradeIntent{
		IntentID:  intentID,
		Version:   "1.0",
		RoomID:    r.ID,
		ChainID:   "atomone-1",
		PartyA:    r.PartyA,
		PartyB:    r.PartyB,
		OfferA:    r.OfferA,
		OfferB:    r.OfferB,
		Fee:       "0",
		FeeToken:  "uatone",
		CreatedAt: time.Now().UTC().Format(time.RFC3339),
		ExpiresAt: time.Now().Add(24 * time.Hour).UTC().Format(time.RFC3339),
		Nonce:     "1",
		Status:    "ready_to_sign",
	}
}
