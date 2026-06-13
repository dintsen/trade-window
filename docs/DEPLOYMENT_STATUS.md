# Deployment Status

**Last updated:** 2026-06-13

---

## Production URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | https://tradewindow.xyz | ✅ Live (Vercel) |
| Backend | https://trade-window-production.up.railway.app | ✅ Live (Railway) |
| GitHub | https://github.com/dintsen/trade-window | ✅ Public |

---

## Frontend (Vercel)

- Platform: Vercel
- Root directory: `apps/web`
- Framework: Next.js 14+ (App Router)
- Deploy trigger: push to `main`
- Custom domain: `tradewindow.xyz`

**Pages deployed:**
- `/` — Landing + donation banner
- `/board` — Public OTC listings
- `/board/new` — Post listing (Token + NFT tab, balance fetch + Max button)
- `/request` — Private deal request
- `/trade` — Trade room (wallet connect + room state)
- `/history` — My Trades (preview)
- `/trades` — My Trades (alias)

---

## Backend (Railway)

- Platform: Railway
- Service: `trade-window-production`
- URL: `https://trade-window-production.up.railway.app`
- Language: Go
- Storage: **Postgres (Supabase)** ✅

**Environment variables (names only — no values):**
```
STORAGE_DRIVER      # "postgres" (active)
DATABASE_URL        # Supabase connection string (confirmed working)
ALLOWED_ORIGINS     # https://tradewindow.xyz,https://www.tradewindow.xyz,http://localhost:3000
MAX_WS_MESSAGE_BYTES
PORT
```

**Active endpoints:**
- `GET /health` — ✅
- `GET /api/board/listings` — ✅
- `POST /api/board/listings` — ✅
- `POST /api/requests` — ✅
- `GET /api/me/trades?wallet=<address>` — ✅
- `POST /api/auth/nonce` — ✅ (scaffold: issues 32-byte nonce, 5-min expiry)
- `POST /api/auth/verify` — ⚠️ 501 (scaffold: ADR-036 verification pending)
- `WebSocket /ws/room/:id` — ✅

---

## Storage Status

⚠️ **Production demo currently uses JSONL fallback until Supabase credentials are rotated.**

| Driver | Status | Notes |
|--------|--------|-------|
| Postgres/Supabase | ⚠️ Unverified | `STORAGE_DRIVER=postgres` set in Railway env, but DATABASE_URL validity unconfirmed — credentials may need rotation |
| JSONL | ⚠️ Possible fallback | If DATABASE_URL is invalid, Go backend falls back to JSONL at startup |

**How to verify:** `/health` will return `"storage_driver":"postgres"` once the next Railway deploy goes live (commit `70b668a` adds this field). Until then, storage driver cannot be confirmed externally.

**To fix:** Log into Railway → trade-window-production → Variables → confirm `DATABASE_URL` is a valid Supabase connection string → trigger redeploy.

---

## Database Migrations

| Migration | Status |
|-----------|--------|
| `001_create_trade_window_tables.sql` | Applied when Postgres is active |
| `001_create_board_and_requests.sql` | Applied when Postgres is active |
| `002_add_wallet_history.sql` | Applied when Postgres is active |
| `003_add_wallet_assets_and_nfts.sql` | Applied when Postgres is active |

Migrations run automatically on startup via `storage.RunMigrations()` — no manual SQL needed.

---

## DNS

| Record | Status |
|--------|--------|
| `tradewindow.xyz` | ✅ Points to Vercel |
| `api.tradewindow.xyz` | ⚠️ Not configured — use Railway URL directly |

Do not switch `NEXT_PUBLIC_BACKEND_URL` to `api.tradewindow.xyz` until DNS CNAME is confirmed HTTP 200.

---

## Known Limitations

1. **`api.tradewindow.xyz`**: DNS not yet configured. Backend reachable at Railway URL only.
2. **SWC binary in sandbox**: `npm run build` cannot run in isolated sandbox (no npm registry access). Build runs correctly on Vercel CI.
3. **Wallet history (unsigned)**: `?wallet=` filtering is not cryptographically authenticated. See `docs/WALLET_AUTH_PLAN.md`.
4. **Cosmos wallet signing**: Keplr/Leap/Cosmostation connect is read-only (address only). ADR-036 sign-in planned.
5. **Adena signing**: Disabled in MVP. Adena lacks off-chain message signing API.
6. **Mainnet settlement**: Disabled. No transactions are broadcast. Preview only.
