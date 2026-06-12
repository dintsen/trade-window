# Deployment Status

## Current Production URLs
* **Frontend**: `https://tradewindow.xyz` (Vercel project `trade-window-final`)
* **Backend**: `https://trade-window-production.up.railway.app` (Railway)

## Deployment Method
* **Frontend**: Vercel deployments from GitHub `dintsen/trade-window`, branch `main`, root directory `apps/web`. (Previously manual CLI deploys; switched to git-based deploys on 2026-06-12.)
* **Backend**: Railway. Auto-migrations run at backend startup (`schema_migrations` tracking).

## Working Endpoints
* Frontend `/`, `/board`, `/board/new`, `/request`, `/trade`, `/history`, `/trades` respond with HTTP 200.
* Backend `/health` and `/api/board/listings` respond with HTTP 200.

## Known Production Issues
* **Storage is currently JSONL (ephemeral)**: the Supabase `DATABASE_URL` password was rejected (`28P01 password authentication failed`), so `STORAGE_DRIVER` is set to `jsonl` to keep the service online. Board listings and deal requests do not survive redeploys until the Supabase password is reset and `DATABASE_URL` + `STORAGE_DRIVER=postgres` are set in Railway.
* When switching to Supabase, use the session pooler URL on port 5432 (or add pgx-compatible params). Do not append `?pgbouncer=true` — pgx rejects it and the backend will crash-loop.

## Resolved on 2026-06-12
* Backend `/api/me/trades` is live (returns 200) after fixing Go compile errors that silently broke Railway builds.
* `ALLOWED_ORIGINS` now includes `https://tradewindow.xyz`, `https://www.tradewindow.xyz`, `http://localhost:3000` — board API CORS works from the browser. Verify after every backend env change (curl checks do not catch CORS).
* `/history` and `/trades` are live on the frontend.

## Vercel Backend Target
* The Vercel production environment points directly to the Railway backend URL via `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_WS_URL`.

## Custom API Domain
* The custom domain `api.tradewindow.xyz` is optional and not required for the current deployment.
* If configured in the future:
```txt
Type: CNAME
Host: api
Value: trade-window-production.up.railway.app
```
