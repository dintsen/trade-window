# Security Architecture & Constraints

## CORS Limitations
The WebSocket connection explicitly validates origins via `CheckOrigin` against a strict `ALLOWED_ORIGINS` environment variable. By default, only local development environments (`localhost:3000`, `localhost:3001`) are allowed. Empty origins (such as native apps or cURL/Postman requests) are presently permitted to facilitate local QA and testing. This rule must be tightened before mainnet launch.

## State Mutability
Room state is authoritative on the backend only for live mock session coordination.
- Clients **cannot** forcibly manipulate countdown values.
- Clients **cannot** add assets to an unready room (e.g. while countdown is active or room is cancelled).
- `ToggleLock` actively prevents double-locking race conditions through the `StartCountdown()` atomicity constraint.

**Important Note on Protocol Authority**: The Go backend is *not* the final settlement/protocol authority. Future finalized commitments, signatures, and execution will be recorded and governed entirely by Gno.land smart contracts.

## Production Scaling Notes
The MVP handles state purely via in-memory maps (`h.Rooms`). While this works flawlessly for a single monolithic instance running the backend, it presents a horizontal scaling barrier. If the app is distributed behind a load balancer (e.g., Kubernetes ReplicaSets), websockets might route to instances unaware of the room state. 

**Future Solution:** Instead of heavy backend scaling, the final state synchronization and commitment layer will be offloaded to the Gno.land protocol.


### Gno.land Architecture Note
* **Gno.land Protocol Layer**: Gno smart contracts / realms are the planned authoritative protocol layer.
* **Go Backend**: Coordinates realtime state and acts as a mock room for the current demo.
* **Frontend**: Next.js UI that renders state and will later call wallet/contract APIs directly.
* **Current State**: The Gno layer stores commitments, registry placeholders, and a locally tested escrow state-machine prototype.
* **Limitations**: Gno escrow is not deployed. Mainnet custody, NFT transfer, RWA transfer, and cross-chain atomic settlement are not live.


---
### Current Architectural Positioning
* **Core Definition**: Trade Window = Gno.land smart-contract commitment layer + Go coordination backend + Next.js trade UI.
* **Adena Priority**: Adena is the priority wallet path. The current implementation is a read-only/detection prototype only.
* **Limitations**: Real signing is gated to local/testnet preview. Mainnet settlement is disabled.
* **Gno Contracts**: The Gno contracts are a local validated protocol scaffold. Deployment is not implemented.

### Adena Security Prototype
The Adena integration safely checks for `window.adena` and only calls `AddEstablish` upon explicit user interaction. It does not blindly prompt for signatures or perform automatic transactions, adhering strictly to read-only interaction limits.

### Local Deployment Safety
The `local-deploy-dry-run.sh` script enforces a strict check for the `gnoland` local node before attempting any deployment or interaction. Since the tool is missing, the script halts securely without making unintended network calls or attempting mainnet interactions.

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

## Escrow Security Model

The escrow realm is a protocol state machine, not a production custody claim.

- The deterministic intent hash remains the source of truth for the full bundle.
- `CreateBundleEscrow` can only be called by `partyA`.
- Funding acknowledgement can only be made by declared parties.
- Normal release requires both parties to approve.
- Disputed release/refund requires the declared guarantor.
- The guarantor cannot mutate offers, parties, or intent hashes.
- Frontend direct token sends are blocked unless explicit testnet/local flags are enabled.
- Mainnet transfer flags default to false and are checked in the signing helper.

## Fake Token Protection

Trade Window does not trust display tickers.

Asset verification uses technical identity:

```txt
chainId + technicalDenom
```

Examples:

- `cosmoshub-4 + uatom = ATOM`
- `atomone-1 + uatone = ATONE`
- `stargaze-1 + ustars = STARS`

If a token claims a known ticker on the wrong chain or denom, it must be marked `suspicious`. Backend validation rejects attempts to mark such an asset as `verified`. The local Gno escrow prototype applies the same rule in `CreateVerifiedExchange`.

Remaining production blockers:

- deploy the escrow realm to a known Gno testnet/local chain;
- define the evidence model for guarantor decisions;
- complete external audit before mainnet custody;
- verify NFT and IBC settlement standards before claiming transfer support.
