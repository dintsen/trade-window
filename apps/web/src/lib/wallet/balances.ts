import { WalletBalance } from "./types";
import { getAsset } from "@/lib/assets/asset-registry";

/**
 * Public LCD REST endpoints (cosmos.directory community proxy) used for
 * read-only balance queries from the user's browser. No keys, no signing.
 */
const LCD_ENDPOINTS: Record<string, string> = {
  "cosmoshub-4": "https://rest.cosmos.directory/cosmoshub",
  "stargaze-1": "https://rest.cosmos.directory/stargaze",
  "atomone-1": "https://rest.cosmos.directory/atomone",
};

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

    return data.balances.map((b) => {
      const asset = getAsset(b.denom);
      return {
        denom: b.denom,
        amount: b.amount,
        symbol: asset?.symbol,
        decimals: asset?.decimals,
        chainId,
      };
    });
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
