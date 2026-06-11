# Trade Window Go Backend

This is the Go coordination service for Trade Window. It provides HTTP endpoints for OTC Deal requests and Board listings, as well as WebSocket rooms for real-time mock trade negotiation.

## Local Development

```bash
go run ./cmd/server
```

### Production Deployment Flow

Follow these exact steps to run the backend in a stateless production environment:

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Open the Supabase SQL Editor and run `services/backend-go/migrations/001_create_board_and_requests.sql`.
3. Deploy the Go backend to Render / Railway / Fly.io / VPS using the included `Dockerfile`.
4. Set the following Environment Variables in your hosting provider:
   - `STORAGE_DRIVER=postgres`
   - `DATABASE_URL=postgres://...` (your Supabase connection string)
   - `ALLOWED_ORIGINS=https://tradewindow.xyz` (or your actual Vercel URL)
5. Set the Vercel frontend environment variables:
   - `NEXT_PUBLIC_API_URL=https://<your-backend-url>`
   - `NEXT_PUBLIC_WS_URL=wss://<your-backend-url>/ws`
6. Redeploy the Vercel frontend to apply the new backend URLs.
