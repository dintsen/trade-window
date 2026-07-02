# Source of Truth Audit

Date: 2026-06-15

## Real repository path

`/Users/dmitriydintsen/ai-tools/trade`

## Working patch path

`/Users/dmitriydintsen/ai-tools/projects/trade/trade-window-full-escrow-20260615-230224`

The real production checkout is readable but not writable from this Codex session, so fixes were implemented in the writable working copy above.

The previous checkout at `/Users/dmitriydintsen/ai-tools/projects/trade` is not the production source of truth.

## Git remote

Real upstream: `https://github.com/dintsen/trade-window.git`

Working copy origin: local clone of `/Users/dmitriydintsen/ai-tools/trade`

Credential hygiene note: the real checkout's local remote may contain an embedded GitHub credential. Do not copy or expose it; rotate/remove it if still valid.

## Current branch

`codex/full-escrow`

## Latest commit

`5bd1284 fix: resolve tooltip clipping inside mockup panels by removing overflow-hidden`

## Vercel production source status

The real source contains production routes and v4 assets. This working copy was cloned from that source before changes.

Not verified:

- No local `.vercel` project linkage or `vercel.json` was found.
- Exact Vercel project-to-Git linkage should be confirmed in the Vercel dashboard.

## Production routes found locally

- `apps/web/src/app/board`
- `apps/web/src/app/board/new`
- `apps/web/src/app/request`
- `apps/web/src/app/trade`
- `apps/web/src/app/history`
- `apps/web/src/app/trades`
- `apps/web/src/app/ecosystem`
- `apps/web/src/app/whitepaper`
- `apps/web/src/app/company`
- `apps/web/src/app/careers`
- `apps/web/src/app/escrow`
- `apps/web/src/app/thank-you`

Frontend build generated:

- `/`
- `/_not-found`
- `/board`
- `/board/new`
- `/careers`
- `/company`
- `/ecosystem`
- `/escrow`
- `/history`
- `/request`
- `/thank-you`
- `/trade`
- `/trades`
- `/whitepaper`

## Missing routes

No production-critical route mismatch was found in the real source.

## Favicon/OG v4 status

The real source includes v4 favicon/OG assets referenced by `apps/web/src/app/layout.tsx`.

Found:

- `apps/web/public/favicon-v4.svg`
- `apps/web/public/favicon-v4.ico`
- `apps/web/public/apple-touch-icon-v4.png`
- `apps/web/public/og-image-v4.png`

## Backend source status

Go backend source is present in `services/backend-go` and passes tests with a writable `GOCACHE`.

Found:

- `services/backend-go/Dockerfile`
- `services/backend-go/internal/board`
- `services/backend-go/internal/requests`
- `services/backend-go/internal/ws`
- `services/backend-go/internal/rooms`
- `services/backend-go/migrations`

Implemented local backend routes include:

- `/health`
- `/api/board/listings`
- `/api/board/listings/{id}`
- `/api/deal-requests`
- `/rooms/{id}`
- `/ws`

## Gno source status

Gno realms are present in `gno/realms/tradewindow`. Full local Gno tests pass via `scripts/gno/test-contracts.sh`.

Found:

- `board`
- `escrow`
- `fees`
- `intents`
- `registry`
- `rooms`
- `token`

Gno CLI status:

```txt
gno version: master.3150+b738c1083
gnoland missing
```

## Problems caused by previous wrong checkout

The older foundation checkout did not match production routes and could not reliably audit `/board`, `/board/new`, `/request`, `/history`, `/trades`, or `/escrow`.

That caused false or stale conclusions that production routes, backend board/request APIs, v4 assets, and Git source metadata were missing.

## Validation results

Frontend lint:

```txt
npm run lint
PASS
```

Frontend build:

```txt
npm run build
PASS
```

Note: `npm run build` uses `next build --webpack` in this working copy because Turbopack attempted a sandbox-forbidden local port bind during CSS processing.

Backend tests:

```txt
GOCACHE=/private/tmp/trade-window-go-build-cache go test ./... -count=1 -v
PASS
```

Gno tests:

```txt
scripts/gno/test-contracts.sh
PASS
```

Dev server smoke test:

```txt
Blocked by sandbox: listen EPERM 127.0.0.1:3210
```

Production config findings:

- `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` are still explicit environment inputs.
- Mainnet transfer flags default to false.
- Gno escrow settlement requires `NEXT_PUBLIC_ENABLE_ESCROW_TESTNET_SETTLEMENT=true`.

## Safe next step

Review and merge the working-copy changes into the real repository path, then run the same test commands from the real checkout before deployment.
