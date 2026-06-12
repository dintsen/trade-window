package history

import (
	"context"
	"sort"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresHistoryStore struct {
	pool *pgxpool.Pool
}

func NewPostgresHistoryStore(pool *pgxpool.Pool) *PostgresHistoryStore {
	return &PostgresHistoryStore{pool: pool}
}

func (s *PostgresHistoryStore) GetHistoryByWallet(ctx context.Context, wallet string) ([]HistoryItem, error) {
	var history []HistoryItem

	// 1. Get Listings
	qListings := `SELECT id, status, created_at, updated_at, offer_asset, want_asset, amount_range
		FROM board_listings WHERE creator_wallet = $1`
	rowsL, err := s.pool.Query(ctx, qListings, wallet)
	if err == nil {
		for rowsL.Next() {
			var i HistoryItem
			i.Type = "listing"
			i.Role = "maker"
			var offer, want string
			err := rowsL.Scan(&i.ID, &i.Status, &i.CreatedAt, &i.UpdatedAt, &offer, &want, &i.Amount)
			if err == nil {
				i.AssetPair = offer + " / " + want
				history = append(history, i)
			}
		}
		rowsL.Close()
	}

	// 2. Get Requests
	qRequests := `SELECT id, status, created_at, offer_asset, want_asset, amount_range
		FROM deal_requests WHERE requester_wallet = $1`
	rowsR, err := s.pool.Query(ctx, qRequests, wallet)
	if err == nil {
		for rowsR.Next() {
			var i HistoryItem
			i.Type = "request"
			i.Role = "requester"
			var offer, want string
			err := rowsR.Scan(&i.ID, &i.Status, &i.CreatedAt, &offer, &want, &i.Amount)
			if err == nil {
				i.UpdatedAt = i.CreatedAt
				i.AssetPair = offer + " / " + want
				history = append(history, i)
			}
		}
		rowsR.Close()
	}

	// 3. Get Rooms
	qRooms := `SELECT id, state, created_at, updated_at, party_a, party_b, tx_hash, commitment_hash
		FROM trade_rooms WHERE party_a = $1 OR party_b = $1`
	rowsRm, err := s.pool.Query(ctx, qRooms, wallet)
	if err == nil {
		for rowsRm.Next() {
			var i HistoryItem
			i.Type = "room"
			var partyA, partyB string
			var txHash, commitHash *string
			err := rowsRm.Scan(&i.ID, &i.Status, &i.CreatedAt, &i.UpdatedAt, &partyA, &partyB, &txHash, &commitHash)
			if err == nil {
				if partyA == wallet {
					i.Role = "party_a"
					i.Counterparty = partyB
				} else {
					i.Role = "party_b"
					i.Counterparty = partyA
				}
				if txHash != nil {
					i.TxHash = *txHash
				}
				if commitHash != nil {
					i.CommitmentHash = *commitHash
				}
				history = append(history, i)
			}
		}
		rowsRm.Close()
	}

	// Sort descending by created_at
	sort.Slice(history, func(i, j int) bool {
		return history[i].CreatedAt.After(history[j].CreatedAt)
	})

	return history, nil
}
