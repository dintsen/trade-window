# Delivery Report — Trade Window Production Hardening

Date: 2026-07-02 · Repo: `trade-window-full-escrow-20260615-230224` (git, main)
Commits: `5b6d1ea` → `8f703a1` (6 substantive commits)

## Fully implemented (code + tests)

- **Mock/demo isolation.** Mock wallet UI, adapter and connect() are gated by
  `NEXT_PUBLIC_ENABLE_MOCK_WALLET` (default OFF). Production UI shows only
  Adena/Keplr/Cosmostation. No fake Sign & Execute path: all transfer/signing
  helpers hard-block via flags, mainnet blocked by default.
- **Real wallets.** Adena (AddEstablish/GetAccount/DoContract), Keplr &
  Cosmostation (enable/getKey/offline signer, AtomOne suggestChain with atone
  prefix + PHOTON fees). Missing-wallet detection, no auto-popups, chain ID +
  address + provider displayed. Zero seed-phrase/private-key touchpoints
  (grep-verified).
- **Real asset discovery.** LCD balance queries (cosmoshub-4, stargaze-1,
  atomone-1) + Gno ABCI balances; NEW: IBC denom-trace resolution
  (`lib/wallet/ibc.ts`) → path/base denom shown and stored in intent; registry
  authenticity checks (fake ticker → suspicious, unknown → unknown), backend
  re-validates with tests.
- **Backend hardening.** Origin allowlist, wallet/clientId validation, full
  asset payload validation, 16KB WS cap, NEW per-connection rate limit
  (120/min), room expiry + cleanup, third-user/seat-hijack rejection,
  Postgres or JSONL storage, no keys/custody.
- **Deterministic intent.** Canonical asset ordering, stable serialization,
  chain ID/parties/amounts/denoms/version/fee + NEW deterministic `ExpiresAt`
  (fixed at ready_to_sign, inside the hash). Hash stability + expiry tests.
- **Gno realms (7).** rooms, intents (dual-sign commitments with party/hash
  validation), registry, fees, escrow (full lifecycle + disputes), board,
  token — migrated to the current crossing ABI (`cur realm`), `gno test` PASS.
- **Deployment config.** Backend Dockerfile + `render.yaml`, Vercel env
  contract, canonical flags `ENABLE_REAL_WALLET` / `ENABLE_GNO_COMMIT` /
  `ENABLE_TESTNET_SETTLEMENT` / `ENABLE_MAINNET_SETTLEMENT=false` (legacy
  names still honored). No localhost hardcoding (env-driven WS/API/RPC).

## Verified on localnet (chainid `dev`, gnokey, real signed txs)

- addpkg of all 7 realms — OK.
- Dual-sign intent: partyA "committed" → partyB "co-signed" →
  `IsDualSigned=true`; wrong hash rejected ("intent hash mismatch"); stranger
  rejected ("caller is not a party").
- Escrow lifecycle: created→funding→funded→release_pending→release_ready→released.
- Critical bug found & fixed by this e2e: realms were NOT callable on-chain
  before the crossing-ABI migration (unit tests alone hid this).

## On testnet / production

- Nothing new deployed in this pass (sandbox has no deploy credentials).
  Exact runbook: `docs/deployment.md` (Render backend + api.tradewindow.xyz
  DNS + Vercel env). Existing tradewindow.xyz Vercel deploy remains as-is.

## Still unsupported / honest blockers

- **Atomic cross-chain settlement (AtomOne asset ⇄ Gno asset) is NOT possible
  today** with current Gno/AtomOne/IBC tooling — no IBC connection between
  them. Supported paths implemented instead: (a) on-chain dual-sign intent
  commitments on Gno, (b) coordinated wallet-signed transfers per chain with
  real tx-hash feedback, (c) Gno-native escrow realm (state machine verified;
  actual GNOT custody via realm banker is future work needing approval+audit).
  This is Definition-of-Done §7 outcome D for the atomic case, with A/B
  partially delivered.
- Gno testnet realm deployment: pending your approval + key
  (`ENABLE_GNO_COMMIT` stays false until then).
- Two-wallet manual QA: requires real browser extensions —
  plan in `docs/manual-qa-two-wallets.md`.
- Public LCD endpoints (cosmos.directory) are a third-party dependency —
  make them env-configurable before scale.

## Remaining risks

- Escrow realm holds no funds yet (records/state only) — do not market it as
  custody. gno chain/test13 dev-snapshot quirks documented (auth query after
  restart, validator state on chain reset). JSONL storage is
  ephemeral on Render — switch to Postgres for durable board/requests.

## Exact commands (local)

```bash
# Backend
cd services/backend-go && go test ./... && go run ./cmd/server
# Frontend
cd apps/web && npm install && npm run lint && npx tsc --noEmit && npm run build
# Gno
cd gno/realms/tradewindow/<realm> && gno test .
# Localnet e2e — see docs/gno-local-deployment.md + docs/gno-contracts.md
```

## Test results (this pass)

- `go test ./...`: 5/5 suites ok (auth, board, gno, rooms, ws) — includes new
  intent-expiry and rate-limit tests.
- `npx tsc --noEmit`: 0 errors. `eslint`: 0 errors. `next build`: 15/15 pages.
- `gno test`: 7/7 realms ok.
- Localnet e2e: all positive and negative cases passed (table in
  `docs/qa-audit.md`).

## URLs

- Frontend (existing): https://tradewindow.xyz (Vercel)
- Backend (to be created by runbook): https://api.tradewindow.xyz → Render
- Localnet used for e2e: sandbox-only (chainid `dev`), not public.
