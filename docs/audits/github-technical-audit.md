# GitHub Technical Audit

## Scope

Audit target: Trade Window public GitHub source at `https://github.com/dintsen/trade-window.git`.

Real working repository: `/Users/dmitriydintsen/ai-tools/trade`.

Branch: `codex/technical-audit-fixes`.

Main baseline commit: `8410a5c feat: Gno.land wallet integration and testnet transfer prototype`.

This audit covers frontend routes, trade room behavior, board/request flow, backend API and WebSocket coordination, Gno realm readiness, wallet/Gno integration, environment configuration, security/privacy posture, tests, and production readiness. Branding, favicon, OpenGraph assets, pitch decks, grants, Starknet, Cairo, EVM, MetaMask, wagmi, viem, RainbowKit, Hardhat, and Foundry work are intentionally out of scope.

## Source Of Truth

The local repository at `/Users/dmitriydintsen/ai-tools/trade` matches the public GitHub repository and contains the production product routes:

- `apps/web/src/app/board`
- `apps/web/src/app/board/new`
- `apps/web/src/app/request`
- `apps/web/src/app/trade`
- `services/backend-go`
- `gno/realms/tradewindow`

The older checkout under `/Users/dmitriydintsen/ai-tools/projects/trade` is not the production source for this pass and was not patched.

## Baseline Validation

Frontend baseline:

- `npm install`: completed; npm reported 2 moderate vulnerabilities.
- `npm run lint`: failed with explicit `any` errors in `apps/web/src/lib/wallet/adena-wallet.ts` and unused import warnings.
- `npm run build`: passed.

Backend baseline:

- `go test ./... -count=1 -v`: passed with `GOCACHE=/private/tmp/trade-go-build-cache`.

Gno baseline:

- `gno`: not found.
- `gnokey`: not found.
- `gnodev`: not found.
- Gno tests were not run because required local tooling is missing.

## P0 Findings And Fixes

### P0: Source-of-truth mismatch risk

The earlier local checkout did not contain the production routes. Using it for feature work would create false audit results and likely patch the wrong product.

Status: fixed for this workstream by confirming `/Users/dmitriydintsen/ai-tools/trade` is the GitHub-synced source and working only there.

### P0: Localhost backend URLs were hardcoded in frontend source

The web app had hardcoded `http://localhost:8080` and `ws://localhost:8080/ws` behavior in source. Production needs deploy-time API and WebSocket configuration.

Status: fixed.

Changes:

- Added `apps/web/src/lib/config/index.ts`.
- Added `apps/web/src/lib/config/feature-flags.ts`.
- Replaced `apps/web/src/lib/config.ts`.
- Updated `apps/web/src/lib/board/api.ts`.
- Updated `apps/web/src/hooks/use-trade-room.ts`.
- Added `apps/web/.env.example`.

Production examples are now documented as:

```env
NEXT_PUBLIC_API_URL=https://api.tradewindow.xyz
NEXT_PUBLIC_WS_URL=wss://api.tradewindow.xyz/ws
```

If backend configuration is missing, the frontend now shows a backend-unavailable state instead of simulating successful room actions.

### P0: Mainnet transfer safety guard was insufficiently explicit

The UI needed to avoid implying that real mainnet transfer execution is live.

Status: fixed.

Changes:

- Added feature flags for Adena, Gno preview, Gno testnet transfers, and Gno mainnet transfers.
- Mainnet transfers default to disabled.
- Disabled transfer UI uses the required wording: `Real token transfer is disabled in this MVP. Use testnet/local mode only.`
- Signing copy now refers to testnet/local transaction flow rather than generic broadcast.

### P0: WebSocket origin policy was too permissive

Backend WebSocket and CORS behavior needed an environment-based allowlist.

Status: fixed.

Changes:

- Added `ALLOWED_ORIGINS` handling for HTTP and WebSocket origin checks.
- Added production-safe env example:

```env
ALLOWED_ORIGINS=http://localhost:3000,https://tradewindow.xyz,https://www.tradewindow.xyz
```

### P0: Hash-critical intent payload used unstable data

Intent generation must be deterministic for the same final trade state. Hash-critical data must not depend on `time.Now()` or unstable asset ordering.

Status: fixed.

Changes:

- Removed unstable timestamps from the hash-critical generated intent payload.
- Used room ID as deterministic nonce for the current room-state commitment.
- Added canonical asset ordering before hashing.
- Added backend tests proving stable intent hash generation for equivalent room state and asset order permutations.

## P1 Findings And Fixes

### P1: WebSocket message size and payload validation were incomplete

Oversized or malformed messages could consume unnecessary resources, and trade asset payloads were not strict enough for public beta readiness.

Status: fixed.

Changes:

- Added `MAX_WS_MESSAGE_BYTES`, defaulting to `16384`.
- Applied WebSocket read limit.
- Reject oversized messages with `message_too_long`.
- Added wallet query validation.
- Added trade asset validation for ID, type, amount, display denom, technical denom, chain ID, source, decimals, verification status, metadata, and IBC trace fields.

### P1: Wallet/Adena integration used unsafe typing

The Adena adapter used broad `any` typing and did not clearly model provider behavior.

Status: fixed.

Changes:

- Added typed `AdenaProvider`, `AdenaAccountInfo`, and `AdenaContractRequest` interfaces.
- Removed direct `window as any` usage from the Adena adapter and transfer component.
- Kept wallet connection user-initiated.
- Did not add private-key, seed-phrase, backend signing, or mainnet broadcast behavior.

### P1: Product copy over-implied settlement capability

Several pages used language that could overstate execution or settlement guarantees.

Status: fixed.

Changes:

- Rewrote high-risk phrasing toward `structured OTC coordination`, `future Gno.land commitment layer`, no custody, and no guaranteed execution.
- Kept the frontend scope as MVP/research prototype where settlement is not live mainnet transfer execution.

## Remaining P1/P2 Risks

- Gno CLI tooling is missing locally, so Gno realm tests and deployment validation are blocked.
- npm reports 2 moderate vulnerabilities after install; these need a dependency audit before public beta.
- Production backend hosting and Vercel environment variables still require manual configuration outside this code branch.
- Gno/Adena APIs should be rechecked against live provider documentation before enabling any non-local transaction flow.
- CI status was not verified from GitHub Actions in this local pass.

## Final Validation

Final local validation for this branch:

- `npm run lint`: passed.
- `npm run build`: passed.
- `go test ./... -count=1 -v`: passed with `GOCACHE=/private/tmp/trade-go-build-cache`.
- `which gno`: not found.

Gno tests remain blocked until `gno` is installed.

## Safe Next Step

Open a pull request for `codex/technical-audit-fixes`, configure production environment variables for the deployed frontend/backend, install Gno tooling locally or in CI, and then run a focused Gno realm validation pass before any wallet transfer or signing feature work continues.
