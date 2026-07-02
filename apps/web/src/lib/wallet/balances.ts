import { WalletBalance } from "./types";
import { getAsset } from "@/lib/assets/asset-registry";
import { resolveIbcTraces } from "./ibc";

/**
 * Public LCD REST endpoints (cosmos.directory community proxy) used for
 * read-only balance queries from the user's browser. No keys, no signing.
 */
export const LCD_ENDPOINTS: Record<string, string> = {
  "cosmoshub-4": "https://rest.cosmos.directory/cosmoshub",
  "stargaze-1": "https://rest.cosmos.directory/stargaze",
  "atomone-1": "https://rest.cosmos.directory/atomone",
};

/** Gno.land RPC endpoint for ABCI queries */
const GNO_RPC = "https://rpc.gno.land";

interface BankBalancesResponse {
  balances?: { denom: string; amount: string }[];
}

/**
 * Fetch bank balances for an address. Returns null when live balance reading
 * is not available for the chain (callers must show an honest fallback and
 * must never invent balances).
 */
export async function fetchBalances(
  address: string,
  chainId: string
): Promise<WalletBalance[] | null> {
  const lcd = LCD_ENDPOINTS[chainId];
  if (!lcd) return null;

  try {
    const res = await fetch(
      `${lcd}/cosmos/bank/v1beta1/balances/${encodeURIComponent(address)}`,
      { headers: { accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data: BankBalancesResponse = await res.json();
    if (!data.balances) return [];

    const mapped = data.balances.map((b) => {
      const asset = getAsset(b.denom);
      return {
        denom: b.denom,
        amount: b.amount,
        symbol: asset?.symbol,
        decimals: asset?.decimals,
        chainId,
      };
    });
    // Best-effort IBC denom trace resolution (read-only LCD query).
    return resolveIbcTraces(mapped);
  } catch {
    return null;
  }
}

/**
 * Fetch bank balances from Gno.land via ABCI query.
 * Gno.land does not have a Cosmos SDK LCD endpoint; balances are read
 * through the JSON-RPC `abci_query` method on the RPC node.
 */
export async function fetchGnoBalances(
  address: string
): Promise<WalletBalance[] | null> {
  try {
    const path = `bank/balances/${address}`;
    const res = await fetch(
      `${GNO_RPC}/abci_query?path="${encodeURIComponent(path)}"`,
      { headers: { accept: "application/json" } }
    );
    if (!res.ok) return null;

    const json = await res.json();
    // Response: { result: { response: { value: "<base64>" } } }
    const b64 = json?.result?.response?.value;
    if (!b64) return [];

    // The value is a Protobuf-encoded amino JSON list of coins
    // Gno.land returns it as "(123 ugnot,0 photon)" style or JSON coins
    const decoded = atob(b64);
    // Try JSON first
    try {
      const coins: { denom: string; amount: string }[] = JSON.parse(decoded);
      return coins.map((c) => {
        const asset = getAsset(c.denom);
        return { denom: c.denom, amount: c.amount, symbol: asset?.symbol, decimals: asset?.decimals, chainId: "gno-testnet" };
      });
    } catch {
      // Fallback: parse "123 ugnot,0 photon" format
      return decoded
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const [amount, denom] = s.split(" ");
          const asset = getAsset(denom);
          return { denom, amount, symbol: asset?.symbol, decimals: asset?.decimals, chainId: "gno-testnet" };
        });
    }
  } catch {
    return null;
  }
}

/** Convert base units to a human-readable string respecting decimals. */
export function formatBaseAmount(amount: string, decimals = 6): string {
  if (!/^\d+$/.test(amount)) return amount;
  const padded = amount.padStart(decimals + 1, "0");
  const whole = padded.slice(0, -decimals) || "0";
  const frac = padded.slice(-decimals).replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole;
}

/** Parse a human amount into base units; returns null when invalid. */
export function parseHumanAmount(input: string, decimals = 6): bigint | null {
  const trimmed = input.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  const [whole, frac = ""] = trimmed.split(".");
  if (frac.length > decimals) return null; // more precision than the asset supports
  const fracPadded = frac.padEnd(decimals, "0");
  try {
    return BigInt(whole) * BigInt(10) ** BigInt(decimals) + BigInt(fracPadded || "0");
  } catch {
    return null;
  }
}
