# Database Storage

Trade Window backend storage supports a flexible storage driver abstraction to support local testing (`jsonl`) and production usage (`postgres`).

## Configuration

Set `STORAGE_DRIVER` and `DATABASE_URL` in your environment:

```bash
# Local testing (default)
export STORAGE_DRIVER=jsonl
export BOARD_STORAGE_PATH=./data/board-listings.jsonl
export REQUESTS_STORAGE_PATH=./data/deal-requests.jsonl

# Production
export STORAGE_DRIVER=postgres
export DATABASE_URL=postgres://user:pass@localhost:5432/tradewindow
```

## Schema Migrations

The Postgres schema is initialized via SQL files in `services/backend-go/migrations/`.
Currently contains:

- `001_create_trade_window_tables.sql`: Creates `board_listings`, `deal_requests`, `trade_rooms`, and `trade_events` tables.

## Postgres Integration

- Connection pooling is handled by `pgxpool`.
- Initialized in `services/backend-go/internal/storage/db.go`.
- Each package (`board`, `requests`) defines its own `Store` interface with a `*PostgresXStore` implementation that takes the shared pool.
