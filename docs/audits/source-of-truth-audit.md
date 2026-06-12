# Source of Truth Audit

Date: 2026-06-12

## Real repository path

`/Users/dmitriydintsen/ai-tools/trade`

This is the repository that matches the deployed Trade Window site shape. It contains the production routes, v4 favicon/OpenGraph assets, board/request frontend source, Go backend board/request APIs, Dockerfile, migrations, and Gno realm source/tests.

The previous checkout at `/Users/dmitriydintsen/ai-tools/projects/trade` is not the production source of truth.

## Git remote

`https://github.com/dintsen/trade-window.git`

Note: the local `origin` remote is configured with an embedded GitHub credential in the URL. Do not copy or expose that credential. Rotate it if it is still valid.

## Current branch

`main`

## Latest commit

`8410a5c feat: Gno.land wallet integration and testnet transfer prototype`

Recent history includes:

- `8410a5c feat: Gno.land wallet integration and testnet transfer prototype`
- `272fafd Align roadmap with Gno.land implementation track`
- `febed40 Prepare production backend and storage`
- `0aec4ce Use official Trade Window logo for OG and favicon`
- `bdd3c95 Remove grant and pitch deck artifacts from app repository`

## Vercel production source status

Strong local match to production:

- Production serves `/`, `/trade`, `/board`, `/board/new`, and `/request`.
- This repository contains those same routes under `apps/web/src/app`.
- This repository contains `favicon-v4.svg`, `favicon-v4.ico`, `apple-touch-icon-v4.png`, and `og-image-v4.png`.
- Production metadata observed during audit uses the same v4 asset naming and safety-disclaimer direction present in this repository.

Not verified:

- No local `.vercel` project linkage or `vercel.json` was found.
- Exact Vercel project-to-Git linkage should be confirmed in the Vercel dashboard.

## Production routes found locally

Found:

- `apps/web/src/app/board`
- `apps/web/src/app/board/new`
- `apps/web/src/app/request`
- `apps/web/src/app/trade`
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
- `/request`
- `/thank-you`
- `/trade`
- `/whitepaper`

## Missing routes

No requested production routes are missing from the real repository.

The previous checkout was missing:

- `/board`
- `/board/new`
- `/request`

## Favicon/OG v4 status

Found:

- `apps/web/public/favicon-v4.svg`
- `apps/web/public/favicon-v4.ico`
- `apps/web/public/apple-touch-icon-v4.png`
- `apps/web/public/og-image-v4.png`

These match the production metadata naming observed during the technical audit.

## Backend source status

Backend source exists at `services/backend-go`.

Found:

- `services/backend-go/Dockerfile`
- `services/backend-go/internal/config/config.go`
- `services/backend-go/internal/board`
- `services/backend-go/internal/requests`
- `services/backend-go/internal/ws`
- `services/backend-go/internal/rooms`
- `services/backend-go/migrations/001_create_board_and_requests.sql`

Implemented local backend routes include:

- `/health`
- `/api/board/listings`
- `/api/board/listings/{id}`
- `/api/deal-requests`
- `/rooms/{id}`
- `/ws`

Storage paths exist for:

- JSONL MVP storage
- Postgres storage via `DATABASE_URL`

Validation result:

```txt
go test ./... -count=1 -v
PASS
```

## Gno source status

Gno source exists at `gno/realms/tradewindow`.

Found:

- `rooms/rooms.gno`
- `rooms/rooms_test.gno`
- `intents/intents.gno`
- `intents/intents_test.gno`
- `registry/registry.gno`
- `registry/registry_test.gno`
- `board/board.gno`
- `fees/fees.gno`
- `token/token.gno`

Gno CLI status:

```txt
gno not found
```

Gno tests were not run because the CLI is unavailable in the current shell path.

## Problems caused by previous wrong checkout

The previous audit started from `/Users/dmitriydintsen/ai-tools/projects/trade`, which caused several false or stale conclusions:

- It appeared that `/board`, `/board/new`, and `/request` were missing locally.
- It appeared that the backend lacked board/request APIs.
- It appeared that v4 favicon/OpenGraph assets were missing locally.
- It appeared that the Gno layer only had a minimal `rooms.gno` scaffold.
- It appeared that root Git was unavailable.
- It appeared that `apps/web` was an isolated dirty Create Next App repo.

Those findings apply to the wrong checkout, not to the real production source.

The real repository is clean according to `git status --short`.

## Validation results

Frontend lint:

```txt
FAIL
5 errors, 19 warnings
```

Primary lint blocker:

- `apps/web/src/lib/wallet/adena-wallet.ts` uses explicit `any` types.

Frontend build:

```txt
PASS
```

Note:

- The first build attempt failed because the sandbox could not fetch Google Fonts.
- After network access was granted, `npm run build` passed.

Backend tests:

```txt
PASS
```

Gno CLI:

```txt
gno not found
```

Production config findings:

- `apps/web/src/lib/config.ts` reads `NEXT_PUBLIC_WS_URL`.
- `apps/web/src/lib/board/api.ts` reads `NEXT_PUBLIC_API_URL` and falls back to `http://localhost:8080`.
- `apps/web/.env` currently points to localhost values.
- `apps/web/.env.example` also points to localhost values.

Search findings:

- Only Starknet reference found locally is a defensive warning in `docs/codex-handoff.md`.
- No active Cairo, Argent, Seed Grant, pitch deck, or grant application source references were found in the real repository.

## Safe next step

Use `/Users/dmitriydintsen/ai-tools/trade` as the source of truth going forward.

Before feature work:

1. Confirm Vercel is linked to `github.com/dintsen/trade-window` on branch `main`.
2. Rotate/remove the embedded GitHub credential from the local Git remote URL.
3. Fix frontend lint in the real repo.
4. Configure production `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` only after backend deployment is explicitly approved.
5. Install or expose the `gno` CLI before claiming Gno test status.

