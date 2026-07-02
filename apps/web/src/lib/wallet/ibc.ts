/**
 * IBC denom trace lookup.
 *
 * For `ibc/<HASH>` denoms we query the chain's LCD endpoint
 * (`/ibc/apps/transfer/v1/denom_traces/<HASH>`) to resolve the transfer
 * path and base denom. Read-only, no keys, no signing.
 *
 * A resolved trace does NOT make an asset "verified" — it only exposes the
 * technical route so the user can check the source chain and channel.
 */

import { LCD_ENDPOINTS } from "./balances";

export interface IbcDenomTrace {
  /** e.g. "transfer/channel-0" */
  path: string;
  /** e.g. "uosmo" */
  baseDenom: string;
  /** canonical display form, e.g. "transfer/channel-0/uosmo" */
  trace: string;
}

interface DenomTraceResponse {
  denom_trace?: { path?: string; base_denom?: string };
}

const traceCache = new Map<string, IbcDenomTrace | null>();

export function isIbcDenom(denom: string): boolean {
  return denom.toLowerCase().startsWith("ibc/");
}

/**
 * Resolve the denom trace for an `ibc/<HASH>` denom on a given chain.
 * Returns null when the chain has no LCD endpoint configured, the denom is
 * not an IBC denom, or the lookup fails. Callers must treat null as
 * "trace unavailable" and keep the asset marked unverified.
 */
export async function fetchIbcDenomTrace(
  chainId: string,
  denom: string
): Promise<IbcDenomTrace | null> {
  if (!isIbcDenom(denom)) return null;
  const lcd = LCD_ENDPOINTS[chainId];
  if (!lcd) return null;

  const cacheKey = `${chainId}:${denom}`;
  if (traceCache.has(cacheKey)) return traceCache.get(cacheKey) ?? null;

  const hash = denom.slice(4);
  if (!/^[0-9A-Fa-f]{8,128}$/.test(hash)) {
    traceCache.set(cacheKey, null);
    return null;
  }

  try {
    const res = await fetch(
      `${lcd}/ibc/apps/transfer/v1/denom_traces/${encodeURIComponent(hash)}`,
      { headers: { accept: "application/json" } }
    );
    if (!res.ok) {
      traceCache.set(cacheKey, null);
      return null;
    }
    const data: DenomTraceResponse = await res.json();
    const path = data.denom_trace?.path?.trim();
    const baseDenom = data.denom_trace?.base_denom?.trim();
    if (!path || !baseDenom) {
      traceCache.set(cacheKey, null);
      return null;
    }
    const result: IbcDenomTrace = {
      path,
      baseDenom,
      trace: `${path}/${baseDenom}`,
    };
    traceCache.set(cacheKey, result);
    return result;
  } catch {
    traceCache.set(cacheKey, null);
    return null;
  }
}

/**
 * Enrich a list of balances with IBC traces (best effort, parallel,
 * capped to avoid hammering public LCD endpoints).
 */
export async function resolveIbcTraces<
  T extends { denom: string; chainId: string; ibcTrace?: string; baseDenom?: string }
>(balances: T[], maxLookups = 10): Promise<T[]> {
  const targets = balances.filter((b) => isIbcDenom(b.denom)).slice(0, maxLookups);
  if (targets.length === 0) return balances;

  const traces = await Promise.all(
    targets.map((b) => fetchIbcDenomTrace(b.chainId, b.denom))
  );
  const traceByKey = new Map<string, IbcDenomTrace | null>();
  targets.forEach((b, i) => traceByKey.set(`${b.chainId}:${b.denom}`, traces[i]));

  return balances.map((b) => {
    const trace = traceByKey.get(`${b.chainId}:${b.denom}`);
    if (!trace) return b;
    return { ...b, ibcTrace: trace.trace, baseDenom: trace.baseDenom };
  });
}
