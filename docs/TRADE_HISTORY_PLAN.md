# Trade History Plan

## Product Goal
Add a user-facing exchange history system so users can see where, when, and under what status they exchanged or coordinated trades. The history is designed for future on-chain recording on Gno.land.

## Data Model (Off-chain MVP)
Extend existing tables to map user activity to their wallet address:
- `board_listings.creator_wallet`
- `deal_requests.requester_wallet`
- `trade_rooms.terms_hash`
- `trade_rooms.metadata_hash`
- `trade_rooms.commitment_hash`
- `trade_rooms.tx_hash`

## API Endpoints
- `GET /api/me/trades?wallet=<address>`: Aggregates listings, requests, and trade rooms for a given wallet.
- `GET /api/trades/:id/history`: Alias/wrapper for room history.
- `GET /api/trades/:id/events`: Exposes room events.
- `POST /api/trades/:id/events`: Push a new event.

## Privacy Rules & What Goes On-Chain vs Off-Chain
**Strictly Off-Chain (Postgres only):**
- Email addresses
- Telegram/Discord/X handles
- Private Names
- Private messages and negotiation text

**Safe for On-Chain (Gno.land):**
- Trade ID, Creator Wallet, Counterparty Wallet
- Asset In, Asset Out, Amount In, Amount Out
- Status (e.g., previewed, committed)
- `termsHash = sha256(canonicalTradeTermsJson)`
- `metadataHash = sha256(privateMetadataJson)`
- CreatedAt / UpdatedAt

## On-chain Receipt/Commitment Model
```go
type TradeReceipt struct {
    TradeID       string
    Creator       string
    Counterparty  string
    AssetIn       string
    AssetOut      string
    AmountIn      string
    AmountOut     string
    Status        string
    TermsHash     string
    MetadataHash  string
    CreatedAt     int64
    UpdatedAt     int64
}
```

## MVP Scope
1. Add `creator_wallet` and `requester_wallet` to database tables.
2. Add `terms_hash`, `metadata_hash`, `commitment_hash`, `tx_hash` to database tables.
3. Create `/api/me/trades` endpoint.
4. Create primary `/history` frontend page and `/trades` lightweight alias.
5. Update frontend forms to send `wallet_address` if connected.
6. All mainnet transfers remain disabled.

**Known Limitations**: Wallet filter via `?wallet=<address>` is NOT secure wallet-signature authentication yet. It is currently a dev/MVP filtering tool.

## Future Gno.land Implementation Steps
1. Deploy a Gno.land realm for `TradeReceipts`.
2. Implement wallet signing in the frontend to authorize writing receipts.
3. When a trade reaches `previewed` or `committed`, hash the terms and push the receipt to Gno.land.
4. Record the resulting `tx_hash` back in the Postgres `trade_rooms` table.
