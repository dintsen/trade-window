# Trade Window Product Specification

_Last updated: 2026-06-13_

---

## Product Overview

Trade Window is a safety-first OTC P2P trade room for the AtomOne, Gno.land, and Interchain ecosystem. It is inspired by MMORPG-style trade windows.

Two users enter a private trade room, add assets to their side, inspect the counterparty's assets, lock the trade, wait through a 10-second safety countdown, preview the final intent, and then proceed to signing / settlement.

**Current status**: MVP prototype deployed. Real signing and settlement are not implemented. The Gno.land commitment layer is in development.

---

## Core UX Flow

### 1. Wallet Connect
- User opens `/trade`
- Selects a wallet: Mock (demo), Adena (Gno.land), Keplr or Cosmostation (Cosmos)
- For demo: instant connect as User A or User B
- For real wallets: read-only connection only (MVP)

### 2. Trade Room — Lobby
- User creates a new room → receives a shareable invite link
- URL format: `tradewindow.xyz/trade?room=<uuid>`
- Counterparty opens the link → auto-joins the room
- Both see a split-pane view: My Side / Their Side

### 3. Trade Room — Offer Phase
- Each side adds assets via `offer:add`
- Offers are **append-only** — no silent removal
- Mistakes require cancelling and restarting the trade
- Assets display: technical denom + chain ID + IBC trace if available
- Unknown/unverified assets are visibly marked

### 4. Trade Room — Lock Phase
- Each side can lock their offer
- If one side changes their offer after the other locked → lock resets automatically
- When both sides are locked → 10-second countdown begins
- Cancel is allowed any time during the countdown

### 5. Trade Room — Intent Preview
- After countdown: final intent preview shown
- Intent includes: party addresses, asset lists, intent hash
- User must review before proceeding to signing
- Future: sign via Adena (Gno.land) or Keplr (Cosmos/AtomOne)

### 6. System Log
- Every important action creates a timestamped system log entry
- Chat messages are temporary (cleared on room close)
- Room state is temporary (cleared on disconnect)

---

## OTC Board

### Post a Listing (`/board/new`)
- Select offer asset from supported asset list (GNOT, ATONE, PHOTON, ATOM, STARS, etc.)
- Wallet balance fetched via cosmos.directory LCD (read-only, no signing)
- Max button fills in available balance
- Amount validated: must be > 0 and ≤ available balance
- Listing persisted to Supabase Postgres via Go backend

### View Listings (`/board`)
- Filter by request type (Buy/Sell/Swap/OTC Bundle/NFT)
- Filter by ecosystem (Gno.land/AtomOne/Cosmos/IBC)
- Grid layout for listing cards
- Each listing shows: asset pair, amount, type, chain, timestamp

### Private Request (`/request`)
- Form for structured OTC deal inquiry
- Fields: name, email, social handle, deal type, chain, offer asset, want asset, amount range, message
- Generates email draft on submit (no backend storage of private contact data)
- Routes to `/thank-you` on success

---

## Core Product Rules

These rules are invariant — they must never be broken by any implementation:

1. Offers are append-only
2. There is no silent asset removal
3. Mistakes require cancelling the whole trade and restarting
4. Each user can lock their side
5. Changing an offer after the counterparty locked resets their lock
6. Both sides locked → 10-second countdown
7. Cancel allowed during countdown
8. After countdown → final intent preview before signing
9. Every important action creates a system log
10. Chat is temporary
11. Room state is temporary
12. Asset identity shown technically (denom, chain ID), not only by ticker
13. Unknown assets visibly marked as risky or unverified

---

## Supported Assets (MVP)

| Symbol | Denom | Chain | Status |
|---|---|---|---|
| GNOT | `ugnot` | Gno.land | ✅ Supported |
| ATONE | `uatone` | AtomOne | ✅ Supported |
| PHOTON | `uphoton` | AtomOne | ✅ Supported |
| ATOM | `uatom` | Cosmos Hub | ✅ Supported |
| STARS | `ustars` | Stargaze | ✅ Supported |

More assets can be added via the asset registry (`src/lib/trade/assets.ts`).

---

## Wallet Support

| Wallet | Ecosystem | Status | Notes |
|---|---|---|---|
| Mock Wallet | Demo | ✅ Active | Always available, no real assets |
| Adena | Gno.land | ✅ Read-only | Priority path for Gno.land integration |
| Keplr | Cosmos/AtomOne | ✅ Read-only preview | ADR-036 signing planned |
| Cosmostation | Cosmos/AtomOne | ✅ Read-only preview | ADR-036 signing planned |
| Leap | Cosmos | ❌ Sunset | Leap Wallet shut down May 28, 2026 |

---

## Security Principles

1. Frontend is not trusted
2. Backend is not settlement authority
3. WebSocket room state is temporary
4. Final trade intent must be deterministic
5. Asset display names are not enough — technical denom always shown
6. Unknown assets must be marked
7. User must see final intent preview before signing
8. Any offer change must invalidate the intent hash
9. Any unsupported settlement path marked as unsupported
10. Never hide limitations

---

## Out of Scope (MVP)

- Production token launch
- Real mainnet settlement
- Cross-chain atomic swap
- Full IBC 2.0 execution
- Custodial escrow
- Complex DAO governance
- NFT transfer (unless Gno contract support confirmed)
- Paid production fee system
- Investment or speculative tokenomics
- Production security claims
