# Grant Proposal — Trade Window

**Project:** Trade Window  
**Ecosystem:** AtomOne / Gno.land / Cosmos Interchain  
**Stage:** MVP / Research Prototype  
**Live Demo:** https://tradewindow.xyz  
**Repository:** https://github.com/dintsen/trade-window  
**Date:** 2026-06-13

---

## Project Summary

Trade Window is a non-custodial OTC coordination platform for the AtomOne, Gno.land, and Cosmos ecosystem. It provides a structured, safety-first workflow for two parties to negotiate, inspect, and lock a custom asset deal before any signing step.

The core metaphor is an MMORPG-style trade window: both parties see exactly what is on the table, nothing moves silently, and every asset is identified by its technical denom — not just a display name that can be faked.

Current production status:
- Public OTC Board with listings and filters
- Private deal request form
- P2P trade room with wallet connect, offer building, lock/countdown/intent preview
- My Trades history
- Stargaze NFT discovery (preview)
- Go backend with WebSocket room state machine
- Cosmos wallet support (Keplr, Cosmostation, Adena)
- Mainnet transfers remain **disabled** while the Gno.land commitment layer is finalized

This is not a DEX. It is a coordination layer — a safe place to negotiate, agree, and generate a deterministic intent before any signing occurs.

---

## Live Demo

**https://tradewindow.xyz**

Pages:
- `/` — Landing with product overview and donation support
- `/board` — Public OTC listings (live backend)
- `/board/new` — Post a listing (wallet-aware, balance fetch, Max button)
- `/request` — Private deal request form (email-gated, no public exposure)
- `/trade` — Trade room (wallet connect, room state, lock/unlock, intent hash)
- `/history` — My Trades (coordination history, preview)

Backend (Railway): `https://trade-window-production.up.railway.app`

---

## What Is Currently Working

### Frontend (Next.js, TypeScript, Tailwind CSS)

| Feature | Status |
|---------|--------|
| Landing page with product overview | ✅ Live |
| Public OTC Board with filters | ✅ Live |
| Post listing form (wallet + balances + Max) | ✅ Live |
| Private deal request form | ✅ Live |
| Trade room: wallet connect (Keplr, Cosmostation, Adena, Mock) | ✅ Live |
| Trade room: append-only offer building with explicit quantity | ✅ Live |
| Trade room: lock/unlock, 10s countdown, intent hash preview | ✅ Live |
| Trade room: shareable invite link | ✅ Live |
| Trade room: system log and chat | ✅ Live |
| Stargaze NFT discovery panel (stars1 address) | ✅ Preview |
| My Trades history | ✅ Preview |
| Technical denom display with IBC trace | ✅ Live |
| Unverified/suspicious asset warnings | ✅ Live |
| Donation banner (ATOM + ATONE addresses) | ✅ Live |

### Backend (Go, WebSocket)

| Feature | Status |
|---------|--------|
| Board listings CRUD | ✅ Live |
| Deal request storage | ✅ Live |
| Trade history per wallet | ✅ Preview |
| WebSocket room state machine | ✅ Live |
| Auth nonce scaffold (`POST /api/auth/nonce`) | ✅ Scaffold |
| Auth verify (`POST /api/auth/verify`) | ⚠️ 501 — ADR-036 pending |
| Postgres storage | ✅ Confirmed active — verified 2026-06-13 |
| JSONL fallback | ✅ Active if Postgres unavailable |

### Wallet Support

| Wallet | Ecosystem | Status |
|--------|-----------|--------|
| Mock Wallet | Demo | ✅ Functional |
| Adena | Gno.land | 👁 Preview — connect, read-only |
| Keplr | Cosmos / AtomOne | 👁 Preview — connect, read-only |
| Cosmostation | Cosmos / AtomOne | 👁 Preview — connect, read-only |

No mainnet signing. No transaction broadcast. Preview only.

---

## Alignment with AtomOne and Gno.land

Trade Window is designed for the AtomOne and Gno.land ecosystem specifically.

**ATONE is the canonical ticker** — AON is treated as a deprecated alias internally and never shown in the UI.

**Non-custodial architecture:**
- No private keys are stored
- No assets are locked in a smart contract during the coordination phase
- The backend is not a settlement authority
- Intent preview is shown before any signing step

**Gno.land commitment layer (planned):**
- Trade receipts as Gno.land realms — on-chain commitments without custodial asset transfer
- Public receipt hashes on-chain; private deal data stays off-chain
- Gno language for deterministic contract logic
- ICS-721 NFT transfer research when standard matures

**IBC 2.0 / Eureka readiness:**
- IBC trace tracking for every asset (not just display name)
- Suspicious denom warnings for mismatched IBC origins
- Architecture supports future cross-zone asset routing without assumption of atomic settlement

**AtomOne ecosystem tools:**
- ATONE and PHOTON asset support in the registry
- AtomOne LCD endpoint integration for balance reading
- Donation addresses on Cosmos Hub and AtomOne mainnet

---

## What Grant Funding Would Enable

Trade Window is at MVP stage. Grant funding would accelerate five concrete areas:

### 1. Persistent Backend + Wallet Auth (Month 1–2)

- Fix Postgres/Supabase credentials and confirm production persistence
- Implement ADR-036 signature verification in `/api/auth/verify`
- Frontend sign-in flow: prompt wallet → sign nonce → session token
- Replace `?wallet=` history query with authenticated sessions
- Estimated: 3–4 weeks

### 2. Gno.land Receipt Realm + Testnet (Month 2–4)

- Gno.land realm: `tradewindow` — stores intent commitment hashes
- Each finalized trade intent creates an on-chain receipt on Gno.land testnet
- Receipt contains: deterministic hash, wallet addresses, asset list, timestamp
- No custody — only a commitment record
- Frontend: "Create Gno.land receipt" button after intent preview
- Estimated: 4–6 weeks

### 3. Cosmos / AtomOne Asset and Wallet Hardening (Month 3–5)

- Full Keplr / Cosmostation signing for AtomOne intent submission
- AtomOne asset registry with verified denom list
- IBC denom trace resolution for unknown assets
- Improved suspicious/unverified asset warnings
- Estimated: 3–4 weeks

### 4. Stargaze NFT OTC Support (Month 4–5)

- Verified collection registry integration
- Collection risk / scam warnings
- NFT selection in trade room (real wallet NFTs, not mock)
- NFT intent commitment (collection, tokenId, chain)
- Estimated: 2–3 weeks

### 5. Security Review + Public Demo (Month 5–6)

- Independent security review of backend, WebSocket state machine, and intent hash logic
- Production QA against all documented test cases
- Public demo walkthrough for AtomOne / Gno.land community
- Documentation finalization (architecture, security, IBC2 roadmap)
- Estimated: 2–3 weeks

---

## Milestones

| # | Milestone | Deliverable | Timeline |
|---|-----------|-------------|----------|
| 1 | Persistent backend + wallet auth | Postgres confirmed, ADR-036 verify, signed sessions | Month 2 |
| 2 | Gno.land receipt realm testnet | Gno realm deployed on Gno.land testnet, frontend receipt creation | Month 4 |
| 3 | AtomOne asset + wallet hardening | Keplr/Cosmostation signing, verified asset registry | Month 5 |
| 4 | Stargaze NFT OTC support | NFT discovery, selection, and intent commitment | Month 5 |
| 5 | Public demo + security review | QA report, security review, community demo | Month 6 |

---

## Current Limitations (Transparent)

The following limitations exist at proposal time and are not hidden:

1. **No mainnet settlement** — Trade Window coordinates intent but does not execute transfers
2. **No backend signing** — The backend never holds or uses private keys
3. **No custody** — Assets are never locked in a smart contract during coordination
4. **Wallet auth scaffolded but not complete** — `POST /api/auth/verify` returns 501 (ADR-036 planned)
5. **Postgres confirmed active** — `/health` returns `"storage_driver":"postgres"`; persistence verified 2026-06-13 (listing survived round-trip; private fields stripped via `ToPublic()`)
6. **Gno.land receipt realm** — Scaffold documentation exists; on-chain deployment is a grant milestone
7. **IBC 2.0 / Eureka** — Research direction only; no implementation claimed
8. **Stargaze NFTs** — Discovery via GraphQL API works; selection in trade room requires real wallet connection
9. **No real swap completion** — No claim that a "swap" executes end-to-end
10. **No financial advice** — Trade Window is a coordination tool, not a trading platform

---

## Technical Architecture Summary

```
Frontend (Next.js)
  └── Trade Room UI
  └── OTC Board
  └── Wallet Adapters (Adena, Keplr, Cosmostation)
  └── Asset Registry (technical denoms, IBC trace, risk model)

Backend (Go)
  └── WebSocket Room State Machine
  └── Board Listings API
  └── Trade History API
  └── Auth Nonce Scaffold (ADR-036 planned)
  └── Postgres Storage (Supabase) / JSONL fallback

Gno.land (planned)
  └── tradewindow realm
  └── Intent commitment hashes
  └── Fee logic (future)
  └── Verified asset registry (future)

Interchain
  └── IBC trace lookup (planned)
  └── IBC 2.0 / Eureka research
  └── AtomOne LCD integration (balance reading)
  └── Stargaze GraphQL (NFT discovery)
```

---

## Why AtomOne / Gno.land

AtomOne is focused on security, minimalism, and correct economic incentives — values that align directly with Trade Window's safety-first design philosophy.

Gno.land's deterministic, auditable smart contract model is the right foundation for on-chain trade receipt commitments. Unlike EVM-based alternatives, Gno.land contracts are readable, auditable, and aligned with the interchain's long-term direction.

Trade Window explicitly avoids:
- EVM / Solidity
- MetaMask-first architecture
- wagmi / viem
- Ethereum-centric assumptions

This is built for the Cosmos interchain, starting with AtomOne and Gno.land.

---

## Team

Independent open-source project. Lead developer and contact: see repository.

Trade Window is not affiliated with AtomOne, Gno.land, Ignite, or All in Bits. No official partnerships are implied.

---

## Contact / Links

- Live demo: https://tradewindow.xyz
- Repository: https://github.com/dintsen/trade-window
- Donation (ATOM): `cosmos150tjx63plw3aeqq5uk5vajh3z393u5dr4n23dz`
- Donation (ATONE): `atone150tjx63plw3aeqq5uk5vajh3z393u5drmnkkm6`

---

*Trade Window is an MVP / research prototype. It does not provide custody, financial advice, guaranteed execution, or real settlement. Mainnet transfers remain disabled while the Gno.land commitment layer is finalized.*
