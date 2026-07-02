# Deployment Guide — Trade Window

Last updated: 2026-07-02.

Production topology:

```txt
Vercel (Next.js frontend)  ->  https://tradewindow.xyz
Render (Go backend, Docker) -> https://api.tradewindow.xyz  (WS + REST)
Gno.land testnet/localnet   -> intent commitments / escrow realms
```

---

## 1. Backend — Render (Docker)

The repo contains `render.yaml` (Blueprint) and `services/backend-go/Dockerfile`.

Steps:

1. Push this repository to GitHub/GitLab.
2. In Render: **New → Blueprint Instance**, select the repo. Render reads `render.yaml`.
3. Confirm env vars (defaults are safe):
   - `ALLOWED_ORIGINS=https://tradewindow.xyz,https://www.tradewindow.xyz`
   - `STORAGE_DRIVER=jsonl` (switch to `postgres` + `DATABASE_URL` for durable board/requests/history)
   - `WS_RATE_LIMIT_PER_MINUTE=120`, `MAX_WS_MESSAGE_BYTES=16384`
   - `COUNTDOWN_SECONDS=10`, `INTENT_TTL_MINUTES=15`, `ROOM_EXPIRY_MINUTES=60`
   - `GNO_SETTLEMENT_ENABLED=false` until a public realm deployment is approved
4. Wait for deploy; verify health:
   ```bash
   curl https://trade-window-backend.onrender.com/health
   # {"status":"ok","service":"trade-window-backend","storage_driver":"jsonl"}
   ```
5. DNS (your registrar): `api.tradewindow.xyz` → CNAME → `<service>.onrender.com`,
   then add `api.tradewindow.xyz` as a custom domain on the Render service (TLS auto).
6. Re-verify: `curl https://api.tradewindow.xyz/health`.

Notes:
- JSONL storage lives on the instance disk and is lost on redeploy; use Postgres
  (`render.yaml` has a commented block) for anything you must keep.
- WS room state is intentionally in-memory and temporary (product rule).

### Railway alternative

Railway auto-detects `services/backend-go/Dockerfile`:
`railway init` → set Root Directory to `services/backend-go` → add the same env
vars → attach custom domain `api.tradewindow.xyz`.

---

## 2. Frontend — Vercel

Project root: `apps/web`.

Environment variables (Production):

```txt
NEXT_PUBLIC_API_URL=https://api.tradewindow.xyz
NEXT_PUBLIC_WS_URL=wss://api.tradewindow.xyz/ws
NEXT_PUBLIC_DEMO_MODE=false

# Canonical production flags
NEXT_PUBLIC_ENABLE_REAL_WALLET=true
NEXT_PUBLIC_ENABLE_GNO_COMMIT=false          # enable after realm testnet deploy is approved
NEXT_PUBLIC_ENABLE_TESTNET_SETTLEMENT=false  # enable only for testnet demos
NEXT_PUBLIC_ENABLE_MAINNET_SETTLEMENT=false  # MUST stay false until explicitly approved

# Never set in production:
# NEXT_PUBLIC_ENABLE_MOCK_WALLET
```

Deploy: `git push` (auto) or `vercel --prod` from `apps/web`.

Post-deploy checks:
1. `https://tradewindow.xyz/trade` — the Mock Wallet block must NOT be visible.
2. Connect Keplr/Adena — chain ID, address and wallet source shown in the wallet panel.
3. Without backend the room shows the honest "Backend unavailable" state (no fake sync).

---

## 3. Gno realms

Local development / e2e: see `docs/gno-local-deployment.md`. Realms use the
current crossing ABI (`cur realm` first parameter) and were verified end-to-end
on a localnet (deploy via `gnokey maketx addpkg`, dual-sign intent commit,
escrow lifecycle).

Testnet deployment (when approved):

```bash
gnokey maketx addpkg \
  -pkgpath gno.land/r/tradewindow/intents \
  -pkgdir  gno/realms/tradewindow/intents \
  -gas-fee 1000000ugnot -gas-wanted 500000000 -max-deposit 700000000ugnot \
  -broadcast -chainid <testnet-chain-id> -remote https://rpc.<testnet>.gno.land \
  <your-key>
```

Then set on the frontend: `NEXT_PUBLIC_ENABLE_GNO_COMMIT=true` and configure the
realm path/chain in `lib/gno/*` config; set backend `GNO_RPC_URL`, `GNO_CHAIN_ID`.

---

## 4. Production safety invariants

- `NEXT_PUBLIC_ENABLE_MAINNET_SETTLEMENT` defaults to false; signing helpers
  hard-block mainnet chain IDs unless it is set (`lib/wallet/signing.ts`).
- Mock wallet is compiled out of the UI unless `NEXT_PUBLIC_ENABLE_MOCK_WALLET=true`.
- Backend enforces: origin allowlist, wallet/clientId validation, asset payload
  validation (incl. fake-ticker → suspicious), 16KB message cap,
  120 msg/min per connection, room expiry, third-party join rejection.
- Backend never holds keys or funds; settlement trust lives in wallet signing
  and Gno realms only.
