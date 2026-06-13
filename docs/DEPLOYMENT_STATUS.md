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
- `/board/new` — Post listing (Token + NFT tab)
- `/request` — Private deal request
- `/trade` — Trade room (wallet connect + room state)
- `/history` — My Trades history
- `/trades` — Trade history (alias)

---

## Backend (Railway)

- Platform: Railway
- Service: `trade-window-production`
- URL: `https://trade-window-production.up.railway.app`
- Language: Go
- Storage: JSONL (temporary) / Postgres (when Supabase credentials are fixed)

**Environment variables (names only — no values):**
```
STORAGE_DRIVER      # "jsonl" (temporary) or "postgres"
DATABASE_URL        # Supabase connection string (blocked: 28P01 auth error)
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
- `WebSocket /ws/room/:id` — ✅

---

## Storage Status

| Driver | Status | Notes |
|--------|--------|-------|
| JSONL | ✅ Active (temporary) | Data may not survive redeploy |
| Postgres/Supabase | ❌ Blocked | `28P01` auth error — credentials need rotation |

**Action required:** Rotate Supabase DB password and update `DATABASE_URL` in Railway to enable durable storage.

---

## Database Migrations

| Migration | Status |
|-----------|--------|
| `001_create_trade_window_tables.sql` | Applied |
| `001_create_board_and_requests.sql` | Applied |
| `002_add_wallet_history.sql` | Applied |
| `003_add_wallet_assets_and_nfts.sql` | Pending (will apply on next Postgres startup) |

---

## DNS

| Record | Status |
|--------|--------|
| `tradewindow.xyz` | ✅ Points to Vercel |
| `api.tradewindow.xyz` | ⚠️ Not configured — use Railway URL directly |

Do not switch `NEXT_PUBLIC_BACKEND_URL` to `api.tradewindow.xyz` until DNS CNAME is confirmed HTTP 200.

---

## Known Blockers

1. **Supabase 28P01**: DB password rejected. Data is ephemeral on JSONL. Fix: rotate password in Supabase dashboard → update `DATABASE_URL` in Railway.
2. **SWC binary in sandbox**: `npm run build` cannot run in isolated sandbox (no npm registry access). Build runs correctly on Vercel CI.
3. **api.tradewindow.xyz**: DNS not yet configured. Backend reachable at Railway URL only.
