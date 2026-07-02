# TradeWindow App Flow & States

This document defines the expected user flow and states for the MVP TradeWindow application.

## 1. Public Routes
- `/` — Landing page. Explains the product, safety mechanics, and future roadmap.
- `/trade` — The mocked MVP Trade Demo Room. Contains the full 2-window demo experience.

*(Future routes: `/trade/new`, `/trade/[roomId]`, `/demo`, `/docs`, `/how-it-works` are planned but not implemented for the MVP.)*

## 2. Onboarding Flow (3-Step Setup)
When a user opens `/trade`, they should be guided clearly:

### Step 1 — Choose Wallet Provider
- User selects a wallet provider from the list (Mock, Keplr, Cosmostation, Adena).
- In the MVP, **only the Mock Wallet is active**. Users click "User A" or "User B".
- Keplr, Cosmostation, and Adena are displayed as "Planned. Not connected in MVP".
- **Explanation:** *"This MVP uses simulated wallets. Real Adena, Keplr and Cosmostation integration is planned after the demo flow is stable. Future finalized commitments will be recorded by Gno smart contracts."*

### Step 2 — Create or Join a Room
- **For User A:** Click "Create Room" -> generates a Room ID. Shows a "Copy Room ID" button.
- **For User B:** Paste a Room ID into an input -> Click "Join Room".

### Step 3 — Build the Trade
- Add demo assets from the Asset Picker.
- Inspect tooltips (technical denoms, source chains).
- Lock the offer.
- Wait for the countdown.
- Review the deterministic intent hash.

## 3. App States
The `/trade` UI must clearly reflect the following 15 states:

| # | State | Description & Available Actions |
|---|---|---|
| 1 | **No wallet selected** | Shows the User A / User B selector. Everything else is disabled. |
| 2 | **Mock wallet selected** | Shows "Mock Wallet Active" badge. Connection to backend is pending. |
| 3 | **Backend disconnected** | Shows a red "Disconnected" status in the top bar. Actions disabled. |
| 4 | **Backend connected** | Shows a green "Connected" status. Can create or join a room. |
| 5 | **No room yet** | User must create or join. Main trade UI is empty/placeholder. |
| 6 | **Room created** | Room ID is visible. Waiting state. Can copy Room ID. |
| 7 | **Waiting for counterparty**| Explains that a second browser window can join using the Room ID. |
| 8 | **Counterparty joined** | Trade window unlocks. Both sides visible. Can open asset picker. |
| 9 | **Editing offers** | Users can add assets. Locks are reset to false. |
| 10 | **User locked** | Current user is locked. Cannot add assets. Waiting for counterparty. |
| 11 | **Counterparty locked** | Counterparty is locked. Current user can still edit or lock. |
| 12 | **Both locked / countdown** | Both locked. Countdown active (e.g., 10s). Editing disabled. |
| 13 | **Ready to sign** | Countdown finished. Final Intent Hash is displayed. "Sign & Settle" button is visible but disabled (with explanation). |
| 14 | **Cancelled** | Trade was cancelled or locks were broken during countdown. |
| 15 | **Error state** | WebSocket or validation error. Displayed gracefully in UI. |

## 4. UI Layout & Structure

### Top Bar
- Logo & "Trade Window Demo"
- Backend connection status (Connected / Disconnected)
- Current Room ID
- Current Room State
- Selected Wallet Mode (Mocked MVP Badge)

### Main Area (Trade Window)
- **My Offer Panel:** Assets added, Lock button/status.
- **Counterparty Offer Panel:** Assets added, Lock status.
- **Asset Cards:** Show display denom, technical denom, and verification status warnings.
- **Empty States:** Clear instructions when empty.

### Right Sidebar (Tabs / Blocks)
- **Setup / Room:** Identity selector, Create/Join actions.
- **Asset Picker:** Categorized lists (Verified, IBC, Suspicious).
- **Chat:** P2P chat room.
- **System Log:** Real-time event feed.

### Final State Area (Intent Preview)
- Appears when `ready_to_sign`.
- Displays Final Intent Hash.
- Displays summary of Party A and Party B offers.
- **Disabled "Sign & Settle" Button.**
- **Explanation Text:** *"Real wallet signing and settlement are planned after wallet research."*

## 5. Copy & Terminology Rules
- **Use:** "Mock wallet active", "Backend state verified", "Demo asset", "Technical denom", "Suspicious display name", "Intent preview only", "No real signing yet".
- **Avoid:** "secure", "guaranteed", "trustless live settlement", "real trade completed", "assets transferred".


---
### Current Architectural Positioning
* **Core Definition**: Trade Window = Gno.land smart-contract commitment layer + Go coordination backend + Next.js trade UI.
* **Adena Priority**: Adena is the priority wallet path. The current implementation is a read-only/detection prototype only.
* **Limitations**: Gno escrow signing is preview/testnet-gated. Mainnet settlement is disabled.
* **Gno Contracts**: The Gno contracts are a local validated commitment scaffold. Deployment is not implemented.

### Adena Integration Note
In the current prototype, connecting the Adena wallet only reads the account address. It does NOT prompt for signatures or broadcast transactions. The Mock Wallet flow remains the fully interactive MVP.

### Gno Deployment Note
The actual deployment of Gno contracts and broadcasting of signatures via the frontend is not implemented. A local deployment dry-run was attempted but is blocked by missing `gnoland` tooling.

## Deal Request / Contact Platform

Trade Window includes a public inquiry flow where users can submit OTC deal requests and contact details for manual follow-up.

This does not execute trades automatically and does not provide custody, financial advice, guaranteed settlement or production wallet signing.

## Public OTC Board

Trade Window provides a public OTC listing board (`/board`) where users can post negotiated deal intents. 
Users can create new listings at `/board/new`. 
Backend endpoints support `GET /api/board/listings`, `POST /api/board/listings`, and `GET /api/board/listings/{id}` using JSONL MVP storage.
Private email and name data are strictly protected and never exposed publicly.
The board does not provide custody, guaranteed matching, automatic settlement, liquidity, or financial advice.
Production storage should later move to Postgres/Supabase or another persistent DB.
