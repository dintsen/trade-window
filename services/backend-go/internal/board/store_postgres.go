package board

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresBoardStore struct {
	pool *pgxpool.Pool
}

func NewPostgresBoardStore(pool *pgxpool.Pool) *PostgresBoardStore {
	return &PostgresBoardStore{
		pool: pool,
	}
}

func (s *PostgresBoardStore) Create(ctx context.Context, listing BoardListing) error {
	q := `INSERT INTO board_listings (
		id, created_at, updated_at, expires_at, status, title, request_type, 
		offer_asset, want_asset, amount_range, chain, public_message, 
		public_contact, contact_method, private_email, private_name, consent_accepted
	) VALUES (
		$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
	)`
	_, err := s.pool.Exec(ctx, q,
		listing.ID, listing.CreatedAt, listing.UpdatedAt, listing.ExpiresAt, listing.Status,
		listing.Title, listing.RequestType, listing.OfferAsset, listing.WantAsset,
		listing.AmountRange, listing.Chain, listing.PublicMessage, listing.PublicContact,
		listing.ContactMethod, listing.PrivateEmail, listing.PrivateName, listing.ConsentAccepted,
	)
	return err
}

func (s *PostgresBoardStore) ListPublic(ctx context.Context) ([]PublicBoardListing, error) {
	q := `SELECT id, created_at, expires_at, status, title, request_type, 
		offer_asset, want_asset, amount_range, chain, public_message, public_contact, contact_method
		FROM board_listings WHERE status = 'open' ORDER BY created_at DESC`
	
	rows, err := s.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var listings []PublicBoardListing
	for rows.Next() {
		var l PublicBoardListing
		err := rows.Scan(
			&l.ID, &l.CreatedAt, &l.ExpiresAt, &l.Status, &l.Title, &l.RequestType,
			&l.OfferAsset, &l.WantAsset, &l.AmountRange, &l.Chain, &l.PublicMessage, 
			&l.PublicContact, &l.ContactMethod,
		)
		if err != nil {
			return nil, err
		}
		listings = append(listings, l)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	
	return listings, nil
}

func (s *PostgresBoardStore) GetPublic(ctx context.Context, id string) (*PublicBoardListing, error) {
	q := `SELECT id, created_at, expires_at, status, title, request_type, 
		offer_asset, want_asset, amount_range, chain, public_message, public_contact, contact_method
		FROM board_listings WHERE id = $1 AND status = 'open'`
	
	var l PublicBoardListing
	err := s.pool.QueryRow(ctx, q, id).Scan(
		&l.ID, &l.CreatedAt, &l.ExpiresAt, &l.Status, &l.Title, &l.RequestType,
		&l.OfferAsset, &l.WantAsset, &l.AmountRange, &l.Chain, &l.PublicMessage, 
		&l.PublicContact, &l.ContactMethod,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &l, nil
}
