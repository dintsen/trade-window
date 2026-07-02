package board

import "context"

type Store interface {
	Create(ctx context.Context, listing BoardListing) error
	ListPublic(ctx context.Context) ([]PublicBoardListing, error)
	GetPublic(ctx context.Context, id string) (*PublicBoardListing, error)
}
