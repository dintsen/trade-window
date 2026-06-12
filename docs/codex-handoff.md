# Trade Window - Codex Handoff

Welcome to Trade Window! This document provides a concise technical onboarding for Codex to quickly understand the current state, architecture, and constraints of the project.

## Critical Project Constraints
> [!IMPORTANT]
> - **This is NOT a Starknet project.**
> - **This is NOT an EVM project.**
> - **This is NOT a Solidity project.**
> - **This is a Gno.land-oriented OTC commitment protocol.**

## Project Purpose
Trade Window is a Gno.land-native OTC trade-room protocol and interface for structured P2P deal coordination. It acts as a mocked environment for negotiating trades via temporary WebSocket rooms and currently uses local Gno contracts as a commitment scaffold.

## Live Information
- **Domain:** [https://tradewindow.xyz](https://tradewindow.xyz)
- **GitHub Repository:** [https://github.com/dintsen/trade-window](https://github.com/dintsen/trade-window)

## Current Architecture
The application runs on three distinct layers:
1. **Next.js Frontend (`apps/web`):** The user interface providing OTC boards, deal requests, and real-time trade rooms.
2. **Go Backend (`services/backend-go`):** An HTTP/WebSocket coordination backend. It manages real-time socket connections for rooms and provides endpoints for public OTC listings.
3. **Gno.land Contracts (`gno/realms/tradewindow`):** The planned protocol authority and commitment layer. Currently, these are a locally tested scaffold.

## What Works Now
- Next.js trade-room UI with state syncing via WebSockets.
- Go WebSocket coordination backend syncing room states for "User A" and "User B".
- Gno.land commitment scaffold with passing local tests (`gno test`).
- Adena / GnoConnect read-only wallet detection prototype.
- Gno commitment call payload preview in the UI.
- Public OTC Board (`/board`) and Deal Requests (`/request`), backed by Go APIs and Postgres/JSONL.
- The "Mock Wallet" demo flow.

## What is Mocked / What Must Not Be Claimed
> [!WARNING]
> - **Real settlement is NOT live.** (Assets are not actually moved).
> - **Real signing is NOT live.** (Adena read-only detection is present, but transactions are only previewed, not signed/broadcast).
> - **Production Gno deployment is NOT complete.** (We are waiting on local dev node deployment steps).
> - **Custody is NOT provided.**

## Gno Direction & Status
Gno is the main protocol direction. The contracts (`rooms`, `intents`, `registry`) exist in `gno/realms/tradewindow` and pass unit tests using `gno test`. We are using the `gno` and `gnokey` CLIs. We currently lack `gnodev` (a local daemon), so we use the `gno test` command as the primary local validation strategy.

## Tests to Run

**1. Frontend:**
```bash
cd apps/web
npm run lint
npm run build
```

**2. Backend (Go):**
```bash
export PATH="$HOME/.local/go/bin:$PATH"
cd services/backend-go
go test ./... -count=1 -v
```

**3. Smart Contracts (Gno):**
```bash
export PATH="$HOME/go/bin:$PATH"
cd gno/realms/tradewindow/rooms && gno test . -v
cd ../intents && gno test . -v
cd ../registry && gno test . -v
```

## Next Planned Gno Tasks
Please refer to `docs/gno-implementation-plan.md` for full details. 
- Hardening the Gno realms.
- Documenting local node and `gnokey` deployment dry-runs.
- Moving the Adena wallet connection from a "read-only preview" to actual transaction signing when explicitly approved by the user.
