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
* Backend `/api/me/trades` requires a Railway redeploy of the latest `main` (auto-migrations + history route added in commits `059ef95`/`a209a95`).
* Railway `ALLOWED_ORIGINS` must include `https://tradewindow.xyz` and `https://www.tradewindow.xyz` — otherwise browser requests to the board API fail CORS while curl checks pass. Verify after every backend env change.

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
