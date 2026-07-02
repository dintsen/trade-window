# Solana Integration Roadmap

_Last updated: 2026-06-16_

## Decision

Solana can be researched as a future external network, but it must not be mixed into the current Gno escrow settlement path.

The safe first milestone is read-only identity and asset discovery:

1. connect a Solana wallet
2. show public key, cluster, SOL balance, token accounts and NFT collection metadata
3. mark Solana assets as external-network assets
4. allow Solana assets in trade intent previews only after their technical identity is deterministic
5. keep settlement marked unsupported until a verified route exists

## Why This Is Separate From Gno Escrow

Solana and Gno use different transaction models.

Solana transactions contain instructions executed by programs and are atomic within one Solana transaction. That does not create automatic atomic settlement with a Gno realm. A cross-network trade would need a separately verified bridge, escrow, attestation, or liquidity path.

## Proposed Architecture

```txt
apps/web
  wallet adapters
    gno/adena
    cosmos/keplr
    cosmos/cosmostation
    solana/phantom or wallet-adapter

  asset readers
    cosmos bank balances
    stargaze nft reader
    solana account/token/nft reader

  trade intent
    network: "gno" | "cosmos" | "stargaze" | "solana"
    technicalDenom / mint / collection contract
    settlementSupport: "preview" | "unsupported" | "testnet" | "mainnet"

gno/realms/tradewindow
  escrow remains Gno-native
  external assets are represented only as hashed intent metadata unless settlement is proven
```

## Solana Wallet Direction

Use a proven Solana wallet adapter only after approval. The current likely path is the Anza/Solana wallet adapter ecosystem for browser wallet connections, with Solana Kit or RPC clients for account/token reads.

Do not add these dependencies until the first Solana phase is approved:

- `@solana/wallet-adapter-react`
- `@solana/wallet-adapter-wallets`
- `@solana/kit`
- token account / NFT metadata libraries

## Required Technical Identity

For any Solana asset shown in Trade Window, display:

- cluster (`mainnet-beta`, `devnet`, or local)
- wallet public key
- mint address
- token account address when relevant
- token program id
- decimals
- balance in base units
- collection/update authority for NFTs when available
- verification status

## Unsupported Until Proven

Do not claim:

- Gno <-> Solana atomic swap
- Solana custody by Gno realm
- NFT transfer support
- production bridge safety
- mainnet settlement

## First Safe Task

Build a read-only Solana research branch that:

1. connects Phantom/Solana wallet in a separate adapter
2. reads SOL balance on devnet/mainnet-beta
3. reads SPL token accounts
4. renders Solana assets with `settlementSupport: "unsupported"`
5. adds tests proving Solana assets cannot be sent through Gno escrow
