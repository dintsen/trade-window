package rooms

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"sort"
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

// primaryChainID derives the chain from the assets. Falls back to atomone-1.
func primaryChainID(offerA, offerB []TradeAsset) string {
	for _, a := range offerA {
		if a.ChainID != "" {
			return a.ChainID
		}
	}
	for _, b := range offerB {
		if b.ChainID != "" {
			return b.ChainID
		}
	}
	return "atomone-1"
}

func (r *Room) GenerateIntent() TradeIntent {
	r.mu.Lock()
	defer r.mu.Unlock()

	canonA := canonicalAssets(r.OfferA)
	canonB := canonicalAssets(r.OfferB)

	// Deterministic expiry: fixed once when the room entered ready_to_sign.
	// Empty until then, so a pre-countdown intent preview is clearly unsigned-ready.
	expiresAt := ""
	if !r.IntentExpiresAt.IsZero() {
		expiresAt = r.IntentExpiresAt.UTC().Format(time.RFC3339)
	}

	intentID := r.ID + "-intent"
	return TradeIntent{
		IntentID:  intentID,
		Version:   "1.0",
		RoomID:    r.ID,
		ChainID:   primaryChainID(canonA, canonB),
		PartyA:    r.PartyA,
		PartyB:    r.PartyB,
		OfferA:    canonA,
		OfferB:    canonB,
		Fee:       "0",
		FeeToken:  "uatone",
		CreatedAt: "",
		ExpiresAt: expiresAt,
		Nonce:     r.ID,
		Status:    "ready_to_sign",
	}
}

func canonicalAssets(assets []TradeAsset) []TradeAsset {
	canonical := append([]TradeAsset(nil), assets...)
	sort.SliceStable(canonical, func(i, j int) bool {
		left := canonicalAssetKey(canonical[i])
		right := canonicalAssetKey(canonical[j])
		return left < right
	})
	return canonical
}

func canonicalAssetKey(asset TradeAsset) string {
	return asset.ChainID + "\x00" +
		asset.SourceChain + "\x00" +
		asset.TechnicalDenom + "\x00" +
		asset.BaseDenom + "\x00" +
		asset.Amount + "\x00" +
		asset.ID + "\x00" +
		canonicalSettlementKey(asset.Settlement)
}

func canonicalSettlementKey(route *SettlementRoute) string {
	if route == nil {
		return ""
	}
	receiverChain := ""
	receiverAddress := ""
	if route.Receiver != nil {
		receiverChain = route.Receiver.ChainID
		receiverAddress = route.Receiver.Address
	}
	feeDenom := ""
	feeAmount := ""
	if route.Fee != nil {
		feeDenom = route.Fee.Denom
		feeAmount = route.Fee.Amount
	}
	return route.Network + "\x00" +
		route.Sender.ChainID + "\x00" +
		route.Sender.Address + "\x00" +
		receiverChain + "\x00" +
		receiverAddress + "\x00" +
		feeDenom + "\x00" +
		feeAmount + "\x00" +
		route.Support
}
