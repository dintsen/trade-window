package history

import (
	"context"
	"time"
)

type HistoryItem struct {
	Type           string    `json:"type"` // "listing", "request", "room"
	ID             string    `json:"id"`
	Role           string    `json:"role"` // "maker", "requester", "party_a", "party_b"
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`

	AssetPair      string    `json:"assetPair,omitempty"`
	Amount         string    `json:"amount,omitempty"`
	Counterparty   string    `json:"counterparty,omitempty"`

	TxHash         string    `json:"txHash,omitempty"`
	CommitmentHash string    `json:"commitmentHash,omitempty"`
}

type Store interface {
	GetHistoryByWallet(ctx context.Context, wallet string) ([]HistoryItem, error)
}
