# Multi-Wallet Settlement Model

_Last updated: 2026-06-16_

## Goal

Trade Window must support trades where each party can use different wallets for sending and receiving on different networks.

Example:

- Party A sends ATONE on AtomOne from an AtomOne wallet.
- Party A receives SOL on Solana to a Solana wallet.
- Party B sends SOL on Solana from a Solana wallet.
- Party B receives ATONE on AtomOne to an AtomOne wallet.

The final intent must include every send/receive address and fee requirement. These details cannot live only in chat.

## Core Rule

Each offered asset has a settlement route:

```txt
asset
  chainId
  technicalDenom / mint / collection
  amount
  settlement
    network
    sender wallet
    receiver wallet
    fee estimate
    support status
```

If the receiver wallet is missing, the trade can still be discussed, but it is not ready for settlement.

## Current Implementation

Frontend:

- `TradeAsset.settlement`
- `SettlementWalletsPanel`
- multiple connected wallet accounts in `wallet-store`
- aggregated token inventory across all connected wallets
- per-token totals by `chainId + denom`
- sender wallet auto-selected from connected accounts by `chainId`
- static fee estimates for Cosmos Hub, AtomOne, Stargaze, Gno testnet and Solana
- final settlement readiness warnings before escrow preview

Backend:

- `TradeAsset.Settlement`
- settlement route validation
- wrong-chain sender/receiver rejection
- settlement route fields included in canonical intent ordering/hash

## Fee Readiness

Fee readiness checks are conservative.

Cosmos SDK style chains use `fee = gas * gas-price`, so the current app checks whether the sender has the fee denom available before final review. Exact fees should later be estimated through wallet simulation/RPC.

Solana base fee is modeled as 5,000 lamports per signature for first-pass readiness, with prioritization fees left for a later adapter.

## Token Totals

The UI shows totals across all connected wallets by technical token identity:

```txt
chainId + denom -> total base amount / display amount
```

Examples:

- `atomone-1 + uatone`
- `cosmoshub-4 + uatom`
- `stargaze-1 + ustars`

Different assets are not added into one fiat number. A combined USD or EUR portfolio value requires a separate price feed/indexer and must not be invented by the frontend.

When the same denom exists in multiple connected wallets, the total is shown at the top, while the asset picker still keeps spend rows tied to the exact sender wallet. This avoids signing from the wrong account.

## Solana Boundary

Solana can be represented in the intent model, but Solana settlement is not enabled.

Solana assets must use:

- `chainId: solana-mainnet-beta` or `solana-devnet`
- mint address as technical identity
- wallet public key as sender/receiver address
- settlement support status `unsupported` until a verified settlement path exists

Do not route Solana assets through the Gno escrow realm as if they were Gno-native.

## What Is Still Missing

- Sharing receiver wallets through the live room state as first-class account announcements.
- RPC simulation for exact fees.
- Price feed/indexer for fiat portfolio value.
- Solana wallet adapter and read-only asset reader.
- UI for selecting receiver wallet from the counterparty's published accounts.
- Contract-level settlement account digests in the Gno escrow realm.

## Safe Next Step

Add a room event for settlement account announcements:

```txt
wallet:add
  party
  chainId
  address
  role: send_receive
  provider
```

Then update the offer builder so the sender chooses one of their accounts and the receiver must choose one of the counterparty's compatible accounts before settlement can be signed.
