import { WalletNft } from "./types";

/**
 * Stargaze NFT lookup (preview support level).
 *
 * Uses the public Stargaze GraphQL API from the user's browser. Read-only:
 * no signing, no transfers. When the API is unreachable, callers must show
 * an honest unavailable state — never fake NFT data.
 */
const STARGAZE_GRAPHQL = "https://graphql.mainnet.stargaze-apis.com/graphql";
const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

interface StargazeTokensResponse {
  data?: {
    tokens?: {
      tokens?: {
        tokenId: string;
        name?: string;
        media?: { url?: string };
        collection?: { contractAddress?: string; name?: string };
      }[];
    };
  };
}

export async function fetchStargazeNfts(
  starsAddress: string,
  limit = 24
): Promise<WalletNft[] | null> {
  if (!starsAddress.startsWith("stars")) return null;

  const query = `
    query OwnedTokens($owner: String!, $limit: Int) {
      tokens(ownerAddrOrName: $owner, limit: $limit) {
        tokens {
          tokenId
          name
          media { url }
          collection { contractAddress name }
        }
      }
    }
  `;

  try {
    const res = await fetch(STARGAZE_GRAPHQL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query, variables: { owner: starsAddress, limit } }),
    });
    if (!res.ok) return null;
    const data: StargazeTokensResponse = await res.json();
    const tokens = data.data?.tokens?.tokens;
    if (!tokens) return null;

    return tokens.map((t) => ({
      chain: "stargaze-1",
      collectionAddr: t.collection?.contractAddress ?? "",
      collectionName: t.collection?.name ?? "Unknown collection",
      tokenId: t.tokenId,
      name: t.name,
      imageUrl: normalizeNftImageUrl(t.media?.url),
    }));
  } catch {
    return null;
  }
}

export function normalizeNftImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("ipfs://ipfs/")) {
    return `${IPFS_GATEWAY}${url.slice("ipfs://ipfs/".length)}`;
  }
  if (url.startsWith("ipfs://")) {
    return `${IPFS_GATEWAY}${url.slice("ipfs://".length)}`;
  }
  return url;
}
