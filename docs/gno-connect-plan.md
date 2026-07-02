# GnoConnect Integration Plan

## 1. What GnoConnect is for this project
GnoConnect serves as the bridge between the Trade Window frontend and the Gno.land blockchain. It provides a standard pattern for users to sign transactions, specifically targeting the `tradewindow` realm to commit to a specific trade intent hash.

## 2. How Adena connection fits into the flow
Adena is the first real wallet path supported by this prototype. By connecting Adena, the frontend detects a valid `gno` ecosystem wallet, identifies the user's address, and prepares the interface for future Gno smart-contract interactions without immediately requesting any signatures.

## 3. What is implemented now
* **Detection:** The frontend safely checks for `window.adena`.
* **Explicit Connect:** A manual "Connect (Read-only)" button initiates the `AddEstablish()` permission request.
* **Account Read:** Upon connection, the frontend fetches the user's address via `GetAccount()` and displays it in the Trade Room.
* **Fallback:** A Mock Wallet remains default for the MVP, and Keplr/Cosmostation are explicitly marked as "Planned later".

## 4. What is not implemented
* Signing transactions.
* Transaction broadcasting.
* Gno realm mutation or execution.
* Gno contract deployment.
* Asset settlement or token transfers.

## 5. Future flow
1. The frontend builds a deterministic `TradeIntent` payload (implemented in `commitment-call.ts`).
2. The user reviews the final intent hash in the "Review Signature Step".
3. Adena will be prompted to sign or submit the commitment call to the Gno RPC.
4. The Gno realm (`gno.land/r/demo/tradewindow/rooms`) stores the user's commitment to the escrow terms.
5. The Go backend remains the realtime coordination layer, listening for on-chain state changes or allowing the frontend to broadcast the finalized proof to counterparty.
