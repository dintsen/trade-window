# Gno.land Protocol Plan

Status: design + local scaffold only. Nothing in this document is deployed to any Gno.land network.

## Goal

A non-custodial commitment/receipt layer on Gno.land: after two parties coordinate a trade off-chain, the deal terms are hashed and recorded on-chain as a verifiable receipt. No funds are held by the realm; it stores proofs, not assets.

## Existing Scaffold

`gno/realms/tradewindow/` contains locally tested realm packages:

* `rooms` — trade room commitments
* `intents` — intent hash storage
* `registry` — verified asset registry placeholder
* `board` — OTC board placeholder
* `fees` — fee accounting placeholder
* `token` — future utility token logic placeholder

## Trade Receipt Model

```go
type TradeReceipt struct {
    TradeID          string
    Maker            string // wallet address
    CounterpartyHash string // or plain address once both parties consent
    AssetIn          string // technical denom
    AssetOut         string
    AmountIn         string
    AmountOut        string
    Status           string // previewed | committed | cancelled
    TermsHash        string // sha256(canonical terms JSON)
    MetadataHash     string // sha256(private metadata JSON), preimage stays off-chain
    CommitmentHash   string
    CreatedAtHeight  int64
    UpdatedAtHeight  int64
}
```

## Realm Functions (planned)

```txt
CreateTradeReceipt(receipt)   — caller must be Maker
UpdateTradeStatus(id, status) — restricted to parties; validated transitions only
CancelTrade(id)               — restricted to parties
GetTradeReceipt(id)           — public read
ListReceiptsByWallet(addr)    — public read
```

## Never On-Chain

Email, Telegram/Discord/X handles, phone numbers, private names, private notes, negotiation/chat text, IP addresses, secrets, private keys. Only hashes of private metadata may be recorded.

## Wallet Path

Adena is the signing direction. Receipt writes require the user to sign a Gno transaction in Adena; the backend never signs and never holds keys. Blocked on Adena/GnoConnect off-chain message-signing standardization for auth (see `WALLET_AUTH_PLAN.md`); transaction signing for receipts is independent of that blocker.

## Rollout Steps

1. Finalize receipt realm API and tests locally (`gno test`).
2. Deploy to a Gno.land testnet once tooling access is available.
3. Frontend: Adena `Sign` flow for `CreateTradeReceipt` with full transaction preview.
4. Record returned `tx_hash` in Postgres `trade_rooms`.
5. Explorer links in My Trades.

Honest-language rule: until step 2 is done and verified, the product must describe this layer as "future Gno.land commitment layer". No deployed/production claims.
