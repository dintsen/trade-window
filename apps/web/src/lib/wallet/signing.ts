/**
 * Transaction signing helpers.
 *
 * Two paths:
 *   1. Cosmos SDK chains (AtomOne, Cosmos Hub, Stargaze) — Keplr / Leap / Cosmostation
 *      `signAndBroadcastCosmos()`
 *   2. Gno.land — Adena DoContract
 *      `signAndBroadcastGno()`
 *
 * IMPORTANT: These are TEST helpers for the MVP demo.
 * They do NOT provide settlement guarantees. The user signs their own tx;
 * counterparty trust is required for P2P trades at this stage.
 */

import { SigningStargateClient, GasPrice } from "@cosmjs/stargate";
import { ATOMONE_CHAIN_CONFIG, EXPLORER_TX } from "./chain-configs";
import { WalletAccount } from "./types";
import { config, TRANSFERS_DISABLED_MESSAGE } from "../config";

export interface SignAndBroadcastParams {
  /** Account from useWalletStore */
  account: WalletAccount;
  /** Recipient address */
  toAddress: string;
  /** Asset minimal denom, e.g. "uatone" */
  denom: string;
  /** Amount in base units (string to avoid bigint serialization issues) */
  amount: string;
  /** Optional memo */
  memo?: string;
}

export interface TxResult {
  txHash: string;
  explorerUrl: string;
}

// ─── Cosmos SDK chains (Keplr-compatible) ────────────────────────────────────

/**
 * Sign and broadcast a MsgSend via Keplr (or Keplr-compatible wallet).
 * Returns txHash on success or throws a user-readable error.
 */
export async function signAndBroadcastCosmos(
  params: SignAndBroadcastParams
): Promise<TxResult> {
  const { account, toAddress, denom, amount, memo = "" } = params;
  const chainId = account.chainId ?? "cosmoshub-4";

  assertTransferEnabled(chainId);

  const keplr = window.keplr;
  if (!keplr) throw new Error("Keplr wallet not found. Please install the Keplr extension.");

  // Ensure AtomOne chain is registered
  if (chainId === "atomone-1") {
    try {
      await keplr.experimentalSuggestChain?.(ATOMONE_CHAIN_CONFIG);
    } catch {
      // Chain may already be registered; continue
    }
  }

  await keplr.enable(chainId);

  const offlineSigner = keplr.getOfflineSigner(chainId);

  // Determine fee currency — AtomOne uses PHOTON for fees
  const feeDenom = chainId === "atomone-1" ? "uphoton" : "uatom";
  const gasPrice = GasPrice.fromString(`0.002${feeDenom}`);

  // Determine RPC endpoint
  const rpcMap: Record<string, string> = {
    "cosmoshub-4": "https://rpc.cosmos.directory/cosmoshub",
    "stargaze-1":  "https://rpc.cosmos.directory/stargaze",
    "atomone-1":   "https://rpc.atomone.xyz",
  };
  const rpc = rpcMap[chainId];
  if (!rpc) throw new Error(`RPC not configured for chain ${chainId}`);

  const client = await SigningStargateClient.connectWithSigner(rpc, offlineSigner, {
    gasPrice,
  });

  const result = await client.sendTokens(
    account.address,
    toAddress,
    [{ denom, amount }],
    "auto",
    memo
  );

  if (result.code !== 0) {
    throw new Error(`Transaction failed (code ${result.code}): ${result.rawLog}`);
  }

  const txHash = result.transactionHash;
  const explorerFn = EXPLORER_TX[chainId] ?? ((h: string) => `#${h}`);
  const explorerUrl = explorerFn(txHash);

  return { txHash, explorerUrl };
}

// ─── Gno.land (Adena) ────────────────────────────────────────────────────────

/**
 * Sign and broadcast a bank MsgSend via Adena wallet on Gno.land.
 * Returns txHash on success or throws a user-readable error.
 */
export async function signAndBroadcastGno(
  params: SignAndBroadcastParams
): Promise<TxResult> {
  const { account, toAddress, denom, amount, memo = "" } = params;

  assertTransferEnabled(account.chainId ?? "gno-testnet");

  const adena = window.adena;
  if (!adena) throw new Error("Adena wallet not found. Please install the Adena extension.");
  if (!adena.DoContract) throw new Error("Adena transaction API is unavailable.");

  // Ensure we're connected
  const established = await adena.AddEstablish("Trade Window");
  if (established?.status === "failure") {
    throw new Error("Adena connection rejected.");
  }

  const response = await adena.DoContract({
    messages: [
      {
        type: "/bank.MsgSend",
        value: {
          from_address: account.address,
          to_address: toAddress,
          amount: `${amount}${denom}`,
        },
      },
    ],
    gasFee: 1,
    gasWanted: 100000,
    memo,
  });

  if (response?.status === "failure") {
    throw new Error(response?.message ?? "Adena transaction rejected.");
  }

  const txHash: string = response?.data?.hash ?? response?.hash ?? "";
  const explorerUrl = EXPLORER_TX["gno-testnet"](txHash);

  return { txHash, explorerUrl };
}

function assertTransferEnabled(chainId: string) {
  const looksLikeMainnet =
    chainId === "atomone-1" ||
    chainId === "cosmoshub-4" ||
    chainId === "stargaze-1" ||
    chainId === "gno-mainnet";

  if (looksLikeMainnet && !config.enableGnoMainnetTransfers) {
    throw new Error(`${TRANSFERS_DISABLED_MESSAGE} Mainnet transfers are disabled.`);
  }
  if (!looksLikeMainnet && !config.enableGnoTestnetTransfers) {
    throw new Error(TRANSFERS_DISABLED_MESSAGE);
  }
}

// ─── Unified entry point ─────────────────────────────────────────────────────

/**
 * Route to the correct signing method based on account ecosystem.
 */
export async function signAndBroadcast(
  params: SignAndBroadcastParams
): Promise<TxResult> {
  if (params.account.ecosystem === "gno") {
    return signAndBroadcastGno(params);
  }
  return signAndBroadcastCosmos(params);
}
