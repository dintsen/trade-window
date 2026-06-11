# Trade Window Go Backend

This is the Go coordination service for Trade Window. It provides HTTP endpoints for OTC Deal requests and Board listings, as well as WebSocket rooms for real-time mock trade negotiation.

## Local Development

```bash
go run ./cmd/server
```

## Production Deployment

This backend provides both standard HTTP API endpoints and WebSocket endpoints. It requires a persistent filesystem if configured to use the JSONL MVP storage (`.jsonl`).

### Environment Variables Required

When deploying to production, provide the following environment variables:

```ini
PORT=8080
ALLOWED_ORIGINS=https://trade-window-final.vercel.app

# Paths for JSONL data files
REQUESTS_STORAGE_PATH=/app/data/deal-requests.jsonl
BOARD_STORAGE_PATH=/app/data/board-listings.jsonl

# Rate Limits and Payload size limits
BOARD_MAX_BODY_BYTES=16384
BOARD_RATE_LIMIT_PER_MINUTE=10
BOARD_DEFAULT_TTL_DAYS=30
```

### Storage Persistence Warning

**IMPORTANT:** This backend currently stores Deal Requests and OTC Board listings using local `.jsonl` files. 

If you deploy to an ephemeral platform (such as standard Render Web Services without a Disk, or standard Heroku / Fly.io deployments without a volume), your data will be **lost on every deployment or restart**. 

#### Deployment Options:

1. **VPS (Recommended for MVP):**
   Deploy via Docker Compose on a traditional VPS (DigitalOcean, Hetzner, AWS EC2) and mount a volume for `/app/data`.
   
2. **Render / Fly.io / Railway:**
   You MUST provision a persistent volume and mount it to `/app/data` to ensure data survives restarts.

### Long-term Storage

For a fully stateless deployment, it is highly recommended to migrate the storage layer from `.jsonl` files to a hosted database like **Supabase (PostgreSQL)** in the near future.
