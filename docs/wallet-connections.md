# Wallet Connections

_Last updated: 2026-06-16_

## Current Wallet Matrix

| Wallet | Ecosystem | Status | Current Capability |
|---|---|---|---|
| Mock Wallet | Gno demo | Live demo | Local account, demo assets, no real signing |
| Adena | Gno.land | Preview | Detect, establish, read account, show Gno escrow payload preview |
| Keplr | Cosmos / AtomOne / Stargaze | Preview | Detect, enable selected chain, read account, read live balances when public LCD is available |
| Cosmostation | Cosmos / AtomOne | Preview | Detect via Keplr-compatible provider, read account, read live balances when public LCD is available |
| Leap | Cosmos | Disabled | Official site says Leap Wallet sunset on 2026-05-28; do not expose as a working connection |

## Wallet Account Data Shown

The trade room now shows a wallet details panel in the setup sidebar after connection.

Displayed fields:

- provider label and provider id
- ecosystem
- chain name and chain id
- full wallet address
- public key when the wallet exposes it
- explorer link when the address belongs to a supported live chain
- live bank balances when the read endpoint is available
- explicit demo/read-only/preview status

## Aggregated Token Inventory

When multiple settlement wallets are connected, the trade room shows an aggregate token inventory across all connected accounts.

Aggregation key:

```txt
chainId + denom
```

This means ATONE on AtomOne and ATOM on Cosmos are shown as separate totals. The app does not show a single fiat portfolio value unless a real price feed/indexer is added later.

## Safety Rules

- Wallet connection does not imply settlement is enabled.
- Frontend wallet state is display/input context only; it is not settlement authority.
- Gno escrow calls remain behind explicit testnet feature flags.
- Mainnet transfer flags remain off by default.
- Unknown balances and denoms are shown technically and must not be invented.
- Mock accounts must never be presented as real on-chain accounts.

## NFT Display

Stargaze NFT reading remains read-only.

If the connected account is on `stargaze-1` and the address uses the `stars` prefix, the NFT input is auto-filled with that address. NFT cards still require collection-contract review before they can be treated as safe trade assets.

## Gno Alignment Notes

The implementation follows the current Gno direction:

- realm calls use origin-caller checks for authorization
- local Gno tests are run with `gno test`
- GnoConnect remains a future compatibility path for metadata/TxLinks
- Adena settlement is not enabled unless the escrow testnet flag is explicitly set

## Remaining Work

- Verify Adena's current `DoContract` response format against an installed browser extension.
- Add GnoConnect metadata once the production RPC/chain id is chosen.
- Add Playwright extension mocks for Keplr/Cosmostation/Adena connection flows.
- Add a signed Gno testnet transaction only after the realm is deployed to a test network.
