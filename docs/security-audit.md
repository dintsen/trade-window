# Security Audit — Trade Window MVP

**Date:** 2026-06-14  
**Auditor:** AI Engineering Agent  
**Scope:** Wallet integration, WebSocket room state machine, Go backend, Gno.land realms, signing flow

---

## 1. Wallet → Chain Labeling

### How it works

Wallet connects → `WalletAccount.chainId` is set → `fetchBalances(address, chainId)` is called → each `WalletBalance` carries its own `chainId` → `walletBalancesToTradeAssets()` maps balances to `TradeAsset` objects with `chainId`, `sourceChain`, `technicalDenom` all properly set → UI shows technical denom in mono, chain name in subtext.

**Status: Working correctly for Keplr/Cosmostation on cosmoshub-4, stargaze-1, atomone-1.**

### Bugs found and fixed

| # | Bug | Severity | Fix |
|---|-----|----------|-----|
| 1 | Adena `connect()` returned no `chainId` or `ecosystem` — balance fetch had no chain context | Medium | Added `chainId: "gno-1"`, `ecosystem: "gno"` to adena account |
| 2 | `COSMOS_CHAIN_IDS` missing `atomone-1` | Low | Added `atomone-1` to the list |

---

## 2. WebSocket Room State Machine

### What is protected

- **Origin check:** `CheckOrigin` blocks WebSocket upgrades from non-allowlisted origins.
- **Address format:** `isValidWalletAddress()` validates that the `?wallet=` param is alphanumeric (prevents injection).
- **Asset validation:** `ValidateTradeAsset()` enforces field lengths, type enum, decimals range, verification status enum.
- **Message size:** `MaxWSMessageBytes` (16 KB default) hard-limits raw WS frames.
- **Chat message length:** 500 char limit.
- **Lock reset rule:** adding an asset resets the counterparty's lock — implemented and enforced.
- **State machine transitions:** strict: assets can only be added in `active` state; lock only works in `active`/`locked_countdown`; cancel works in any pre-final state.

### Bugs found and fixed

| # | Bug | Severity | Fix |
|---|-----|----------|-----|
| 3 | **Room ID was sequential** (`room-1`, `room-2`...) — predictable, attacker could pre-join | High | Replaced with `GenerateRoomID()` using `crypto/rand` → `room-<16hex>` |
| 4 | **`trade:cancel` had no party check** — any observer (3rd WebSocket client in room) could cancel | High | `room.Cancel(party string) error` now verifies `party == PartyA \|\| PartyB` |
| 5 | **No asset count limit** — attacker could spam thousands of assets per offer | Medium | Hard limit: `maxAssetsPerOffer = 20` assets per side |
| 6 | **Intent `ChainID` hardcoded to `"atomone-1"`** regardless of actual assets | Medium | `primaryChainID()` derives chain from first non-empty asset.ChainID |
| 7 | **Intent nonce/time fields changed on every hash generation** — same room could produce different hashes | High | `Nonce` is the cryptographically random room ID and `CreatedAt`/`ExpiresAt` stay outside the hash-critical payload until wallet/deployment expiry is implemented |

### Remaining risk (requires full auth implementation)

| # | Risk | Severity | Status |
|---|------|----------|--------|
| R1 | **Identity spoofing:** `?wallet=` is self-declared, not signed. Anyone knowing your address can join as you | **CRITICAL** | Known gap. `/api/auth/nonce` scaffold exists. Needs ADR-036 signature verification before production. |
| R2 | No rate limiting on WS messages per client | Medium | Not implemented in MVP. Add before production. |
| R3 | `wasLocked` check in `offer:add` reads `room.LockA/B` without the mutex | Low | Acceptable for MVP reads; full mutex scope can be tightened. |

---

## 3. Signing Flow

### Cosmos (Keplr/Cosmostation)

Flow: `signAndBroadcastCosmos()` → `keplr.enable(chainId)` → `SigningStargateClient.connectWithSigner()` → `client.sendTokens()` → Keplr shows user a native confirmation dialog with recipient + amount.

**The user sees the actual transaction in Keplr before signing.** No funds move without explicit wallet approval.

Fee routing: `atomone-1` uses `uphoton`, all others use `uatom`. RPC endpoints are hardcoded — not relying on user input.

### Gno.land (Adena)

Flow: `signAndBroadcastGno()` → `adena.DoContract({messages, gasFee, gasWanted})` → Adena shows user a confirmation dialog.

**Fix applied:** Adena account now always carries `chainId: "gno-1"` and `ecosystem: "gno"`, so routing to the correct signing path is deterministic.

**Remaining gap:** Adena's `DoContract` does not accept an explicit `chainId` parameter — it uses whatever network Adena has active. If the user has the wrong network selected in Adena, the tx will go to the wrong chain. The UI should warn the user to verify their Adena network before signing. This is a Gno.land wallet limitation, not a product bug.

---

## 4. Gno.land Smart Contract Security

### What was broken (now fixed)

| # | Vulnerability | Severity | Fix |
|---|--------------|----------|-----|
| G1 | **`intents.gno:CreateCommitment`** — no caller check. Anyone could create a commitment with arbitrary partyA/partyB | **CRITICAL** | Added `unsafe.OriginCaller()` check: caller must be partyA or partyB |
| G2 | **`rooms.gno:CancelRoom`** — no caller check. Anyone could cancel any room | **CRITICAL** | Added caller check: only partyA or partyB can cancel |
| G3 | **`rooms.gno:CreateRoom`** — no caller check. Anyone could register a room with any parties | High | Added caller must be partyA |
| G4 | `intents.gno` had no dual-sign model — first caller set the commitment for both | High | Added `SignedByA`/`SignedByB` fields; second party co-signs; `IsDualSigned()` checks both |

### What is still a scaffold (not production-ready)

The Gno.land realms are **local protocol scaffolds only**. The escrow realm now implements a tested state machine, but it is not deployed and does NOT yet:
- provide audited mainnet custody;
- atomically swap IBC assets across chains;
- transfer NFTs/RWAs;
- replace wallet-visible final transaction review.

The intents realm records that both parties signed an agreed hash. The escrow realm records funding/release/dispute state for that hash. Mainnet asset transfer remains disabled by default. Cross-chain atomic settlement is out of scope per `PROJECT_CONTEXT.md`.

### Intent hash integrity

- Hash is computed server-side via `SHA-256(json.Marshal(intent))` over canonicalized, sorted assets.
- Any asset change → new hash → both parties must re-lock → countdown restarts.
- The `intentHash` is broadcast to both clients via `trade:ready_to_sign` before any signing action.

---

## 5. Chain Label Visibility in UI

Each token in My Offer and Counterparty Offer shows:
- `displayDenom` (e.g., "ATONE") — prominent
- `sourceChain` (e.g., "AtomOne") — subtext
- `technicalDenom` (e.g., "uatone") — monospace box

NFT cards show: collection name, token ID, and `nft:stars19...420:42` technical denom.

Unknown/IBC assets are marked with `VerifySuspicious` status and a red ShieldAlert icon.

---

## 6. Attack Scenarios Assessment

### "Can the trade be hacked during countdown?"

During `StateLockedCountdown`:
- `offer:add` is rejected — state must be `active` (state machine check in `AddAsset`)
- `trade:lock` is allowed (re-lock is idempotent during countdown)
- `trade:cancel` is now restricted to partyA/partyB only (fixed)
- No message can modify the offer content while countdown is running

**Conclusion: offer content is frozen during countdown.** The only way to break the countdown is explicit cancel by a party (by spec) or disconnect + reconnect.

### "Can a 3rd party intercept and modify assets?"

**Not currently possible via state machine.** `AddAsset(party, asset)` checks `party == PartyA || party == PartyB` — third address is rejected with "unauthorized party".

**The open risk is identity spoofing (R1 above):** if an attacker knows your wallet address and connects before you do, they could join as you. This requires ADR-036 auth before production.

### "Can the intent hash be tampered between server and client?"

The hash is computed server-side and broadcast over WSS. A MITM on the WebSocket would require compromising Railway's TLS. The client should verify the intent hash matches what they signed — this verification step is displayed in the Final Intent Preview modal.

### "Can someone cancel after both locked and countdown finished?"

No. Once state transitions to `StateReadyToSign`, `Cancel()` only works if state is not `completed` or `expired`. But `StateReadyToSign` is also not in the cancel guard — this means cancel IS possible after countdown. This is intentional per product spec ("cancel is allowed until signing"). The Gno.land realm also allows cancel until `"completed"` status.

---

## 7. Summary: What Must Be Done Before Production

| Priority | Item |
|----------|------|
| P0 BLOCKER | Implement ADR-036 wallet signature verification on `/api/auth/verify` — connect WebSocket only after verified |
| P0 BLOCKER | Gno.land: realms need deployment + integration testing on gno.land testnet |
| P1 | Add WS message rate limiting (e.g., 10 msg/sec per client) |
| P1 | Adena: warn user to verify active network before signing |
| P2 | IBC denom trace verification for cross-chain assets |
| P2 | Final intent hash shown to user must match what gets submitted to Gno.land |
| P3 | PHOTON fee availability check before AtomOne signing (PHOTON may have zero balance) |

---

*This audit covers the MVP codebase as of commit `48913f3`. Re-audit required after P0 items are implemented.*
