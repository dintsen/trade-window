package requests

import "context"

type Store interface {
	Create(ctx context.Context, request DealRequest) error
}
