# Deployment Status

## Current Production URLs
* **Frontend**: `https://tradewindow.xyz`
* **Backend**: `https://trade-window-production.up.railway.app`

## Working Endpoints
* Frontend `/`, `/board`, `/board/new`, `/request`, `/trade` respond with HTTP 200.
* Backend `/health` and `/api/board/listings` respond with HTTP 200.

## Vercel Backend Target
* The Vercel production environment currently points directly to the working Railway backend URL (`https://trade-window-production.up.railway.app`).

## Custom API Domain
* The custom domain `api.tradewindow.xyz` is optional and is not required for the current working production deployment.
* If configured in the future, the DNS record should be:
```txt
Type: CNAME
Host: api
Value: trade-window-production.up.railway.app
```
