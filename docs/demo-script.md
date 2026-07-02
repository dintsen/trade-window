# Trade Window Demo Script

## Prerequisites
1. Local Go backend running on port 8080.
2. Next.js frontend running locally on port 3000.
(If backend is unavailable or accessed via public Vercel URL without `NEXT_PUBLIC_WS_URL`, the UI will fall back to an Offline Visual Demo mode preventing runtime crashes).

## Flow
1. **Window 1 (User A):** Open `/trade`, select "Demo User A". Click "Create Room". Copy the Room ID.
2. **Window 2 (User B):** Open `/trade`, select "Demo User B". Paste the Room ID and click "Join Room".
3. Both users see the room transition to "Active".
4. **User A:** Adds 1500 ATONE to the offer.
5. **User B:** Adds 2000 USDC (Suspicious) to the offer. The UI explicitly flags this based on verification status.
6. **User A:** Inspects B's offer and locks.
7. **User B:** Inspects A's offer and locks.
8. The room enters a 10-second countdown.
9. After 10 seconds, the final "Ready to Sign" state is displayed showing the deterministic Intent Hash.
10. The "Sign & Settle" button is deliberately disabled in the demo to reinforce that real wallet integration is not yet complete.

---

## Update 2026-07-02 — Real-wallet demo

The mock-wallet demo now requires `NEXT_PUBLIC_ENABLE_MOCK_WALLET=true` in
`apps/web/.env.local` (never set it in production).

Real-wallet demo path: connect Keplr (or Adena) on both browsers → live
balances appear via LCD → add real asset to the offer → append-only +
double-lock + countdown as before → final intent preview shows technical
denoms, IBC traces and the deterministic intent hash (now including expiry).
On-chain commit/settlement remains gated behind
NEXT_PUBLIC_ENABLE_GNO_COMMIT / NEXT_PUBLIC_ENABLE_TESTNET_SETTLEMENT.
