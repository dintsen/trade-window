/**
 * Global wallet store — module-level singleton.
 * All components that call useWalletStore() share the same state.
 * Uses useSyncExternalStore for safe React 18 concurrent-mode reads.
 */

import { useSyncExternalStore, useCallback } from "react";
import { WalletAccount, WalletAdapter, WalletProviderId } from "./types";
import { mockWalletAdapter, setNextMockUser } from "./mock-wallet";
import { adenaWalletAdapter } from "./adena-wallet";
import {
  keplrWalletAdapter,
  leapWalletAdapter,
  cosmostationWalletAdapter,
} from "./cosmos-wallets";
import { featureFlags } from "../config/feature-flags";

// ─── Adapters ────────────────────────────────────────────────────────────────

const ADAPTERS: Record<WalletProviderId, WalletAdapter> = {
  mock: mockWalletAdapter,
  adena: adenaWalletAdapter,
  keplr: keplrWalletAdapter,
  leap: leapWalletAdapter,
  cosmostation: cosmostationWalletAdapter,
};

/**
 * Adapters actually offered to the UI.
 * The mock wallet is a demo-only tool and is excluded from the production
 * flow unless NEXT_PUBLIC_ENABLE_MOCK_WALLET=true is set explicitly.
 */
const ENABLED_ADAPTERS: WalletAdapter[] = Object.values(ADAPTERS).filter(
  (adapter) =>
    adapter.id === "mock"
      ? featureFlags.enableMockWallet
      : featureFlags.enableRealWallet
);

// ─── Singleton state ─────────────────────────────────────────────────────────

interface WalletState {
  account: WalletAccount | null;
  accounts: WalletAccount[];
  selectedAccount: WalletAccount | null;
  activeProvider: WalletProviderId | null;
  isConnecting: boolean;
  error: string | null;
}

let state: WalletState = {
  account: null,
  accounts: [],
  selectedAccount: null,
  activeProvider: null,
  isConnecting: false,
  error: null,
};

type Listener = () => void;
const listeners = new Set<Listener>();

function setState(patch: Partial<WalletState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

async function connect(
  providerId: WalletProviderId,
  mockUserOrChainId?: "A" | "B" | string
) {
  setState({ isConnecting: true, error: null });
  try {
    if (providerId === "mock" && !featureFlags.enableMockWallet) {
      throw new Error(
        "Mock wallet is disabled. Set NEXT_PUBLIC_ENABLE_MOCK_WALLET=true for local demos only."
      );
    }
    if (providerId !== "mock" && !featureFlags.enableRealWallet) {
      throw new Error(
        "Real wallet connections are disabled (NEXT_PUBLIC_ENABLE_REAL_WALLET=false)."
      );
    }
    const adapter = ADAPTERS[providerId];
    let chainId: string | undefined;
    if (providerId === "mock" && (mockUserOrChainId === "A" || mockUserOrChainId === "B")) {
      setNextMockUser(mockUserOrChainId);
    } else if (typeof mockUserOrChainId === "string") {
      chainId = mockUserOrChainId;
    }
    const acc = await adapter.connect(chainId);
    const accounts = upsertAccount(state.accounts, acc);
    setState({
      account: state.account ?? acc,
      accounts,
      selectedAccount: acc,
      activeProvider: providerId,
      isConnecting: false,
      error: null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown connection error";
    setState({ isConnecting: false, error: msg });
  }
}

async function disconnect() {
  const { activeProvider } = state;
  if (activeProvider) {
    await ADAPTERS[activeProvider].disconnect().catch(() => {});
  }
  setState({ account: null, accounts: [], selectedAccount: null, activeProvider: null, error: null });
}

function upsertAccount(accounts: WalletAccount[], account: WalletAccount): WalletAccount[] {
  const key = accountKey(account);
  const without = accounts.filter((existing) => accountKey(existing) !== key);
  return [...without, account];
}

function accountKey(account: WalletAccount): string {
  return `${account.provider}:${account.chainId ?? "unknown"}:${account.address}`;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useWalletStore() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const stableConnect = useCallback(
    (providerId: WalletProviderId, mockUserOrChainId?: "A" | "B" | string) =>
      connect(providerId, mockUserOrChainId),
    []
  );
  const stableDisconnect = useCallback(() => disconnect(), []);

  return {
    account: snap.account,
    accounts: snap.accounts,
    selectedAccount: snap.selectedAccount,
    activeProvider: snap.activeProvider,
    isConnecting: snap.isConnecting,
    error: snap.error,
    connect: stableConnect,
    disconnect: stableDisconnect,
    adapters: ENABLED_ADAPTERS,
  };
}
