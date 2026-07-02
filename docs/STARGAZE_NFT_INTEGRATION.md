# Stargaze NFT Integration

**Status: Preview (read-only, no transfer)**

## Overview

Trade Window supports Stargaze NFT discovery for connected Cosmos wallets (Keplr and Cosmostation). Users can view Stargaze NFT holdings and select an NFT as the asset in an OTC listing or trade-room offer.

NFT **transfers are not executed**. The platform records NFT identity in the trade intent (chain, collection, token ID, image). Escrow preview records the bundle intent hash; NFT transfer remains out of scope until a supported settlement path is verified.

---

## Architecture

### Frontend

| File | Role |
|------|------|
| `apps/web/src/lib/wallet/nfts.ts` | Stargaze GraphQL query (`fetchStargazeNfts`) |
| `apps/web/src/app/trade/page.tsx` | Trade-room NFT offer picker using the shared NFT helper |
| `apps/web/src/lib/wallet/types.ts` | `WalletNft` type |
| `apps/web/src/components/nfts/NftGrid.tsx` | NFT card grid component |
| `apps/web/src/components/nfts/NftCard.tsx` | Single NFT card |

### Backend

Migration `003_add_wallet_assets_and_nfts.sql` adds:

- `offer_asset_type` / `want_asset_type` — `'fungible'` or `'nft'`
- `offer_asset_chain` / `want_asset_chain` — e.g. `'stargaze-1'`
- `offer_asset_contract` / `want_asset_contract` — collection contract address
- `offer_asset_token_id` / `want_asset_token_id` — NFT token ID
- `offer_asset_metadata_hash` — optional hash of NFT metadata at time of listing

---

## API Used

**Stargaze GraphQL (public, mainnet)**

```
https://graphql.mainnet.stargaze-apis.com/graphql
```

Query: `OwnedTokens(owner: String!, limit: Int)`

Returns: `tokenId`, `name`, `media.url`, `collection.contractAddress`, `collection.name`

The query is made from the **user's browser** — no server-side proxy, no API key required.

---

## WalletNft Type

```ts
interface WalletNft {
  chain: string;           // 'stargaze-1'
  collectionAddr: string;  // contract address
  collectionName: string;
  tokenId: string;
  name?: string;
  imageUrl?: string;
}
```

---

## NFT Card UI

NFT cards show:

- Image (with fallback placeholder)
- Collection name
- Token name / ID
- Chain badge (`Stargaze`)
- Select button

NFT cards are rendered in a grid on `/board/new` under a **"NFT Assets (Preview)"** tab and in `/trade` under **"NFTs via Stargaze"**.

---

## Safety Rules

- No NFT transfer is triggered
- No NFT signing is performed
- No `tokenId` is locked or committed on-chain
- NFT ownership is public on-chain; no private data is combined with it in public APIs
- `privateEmail`, `privateName`, `contactMethod` fields are **never** included in board/history API responses
- If the Stargaze API is unreachable, the UI shows: *"NFT data unavailable — Stargaze API could not be reached."*
- No fake NFT data is ever displayed
- IPFS media URLs are normalized from `ipfs://...` to HTTPS gateway URLs for display

---

## Support Levels

| Feature | Status |
|---------|--------|
| Stargaze GraphQL NFT query | Preview |
| NFT card display | Preview |
| NFT selection in listing | Preview |
| NFT metadata stored in DB | Preview |
| NFT transfer / settlement | Out of scope for MVP |
| Other chains (Omniflix, etc.) | Planned |

---

## Known Limitations

- Stargaze API may have CORS or rate-limit changes — callers handle `null` returns gracefully
- Only `stars1...` addresses work; Cosmos/AtomOne addresses are not Stargaze addresses
- NFT images hosted on IPFS may load slowly; no caching layer yet
- Collection verification status is not checked server-side

---

## Future

- Verified collection registry (on-chain or from Stargaze API)
- Collection risk/scam warnings
- Gno.land NFT standard support when available
- IBC NFT transfer research (ICS-721)
