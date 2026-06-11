package requests

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresRequestStore struct {
	pool *pgxpool.Pool
}

func NewPostgresRequestStore(pool *pgxpool.Pool) *PostgresRequestStore {
	return &PostgresRequestStore{
		pool: pool,
	}
}

func (s *PostgresRequestStore) Create(ctx context.Context, request DealRequest) error {
	q := `INSERT INTO deal_requests (
		id, created_at, name, email, contact_handle, preferred_contact, 
		request_type, offer_asset, want_asset, amount_range, chain, 
		message, consent_accepted, status
	) VALUES (
		$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
	)`
	_, err := s.pool.Exec(ctx, q,
		request.ID, request.CreatedAt, request.Name, request.Email, request.ContactHandle,
		request.PreferredContact, request.RequestType, request.OfferAsset, request.WantAsset,
		request.AmountRange, request.Chain, request.Message, request.ConsentAccepted, request.Status,
	)
	return err
}
