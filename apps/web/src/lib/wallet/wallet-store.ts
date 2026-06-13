import { useState, useCallback } from "react";
import { WalletAccount, WalletAdapter, WalletProviderId } from "./types";
import { mockWalletAdapter, setNextMockUser } from "./mock-wallet";
import { adenaWalletAdapter } from "./adena-wallet";
import {
  keplrWalletAdapter,
  leapWalletAdapter,
  cosmostationWalletAdapter,
} from "./cosmos-wallets";

const ADAPTERS: Record<WalletProviderId, WalletAdapter> = {
  mock: mockWalletAdapter,
  adena: adenaWalletAdapter,
  keplr: keplrWalletAdapter,
  leap: leapWalletAdapter,
  cosmostation: cosmostationWalletAdapter,
};

export function useWalletStore() {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [activeProvider, setActiveProvider] = useState<WalletProviderId | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(
    async (providerId: WalletProviderId, mockUserOrChainId?: "A" | "B" | string) => {
      setIsConnecting(true);
      setError(null);
      try {
        const adapter = ADAPTERS[providerId];
        let chainId: string | undefined;
        if (providerId === "mock" && (mockUserOrChainId === "A" || mockUserOrChainId === "B")) {
          setNextMockUser(mockUserOrChainId);
        } else if (typeof mockUserOrChainId === "string") {
          chainId = mockUserOrChainId;
        }
        const acc = await adapter.connect(chainId);
        setAccount(acc);
        setActiveProvider(providerId);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Unknown connection error");
        }
      } finally {
        setIsConnecting(false);
      }
    },
    []
  );

  const disconnect = useCallback(async () => {
    if (activeProvider) {
      await ADAPTERS[activeProvider].disconnect();
    }
    setAccount(null);
    setActiveProvider(null);
    setError(null);
  }, [activeProvider]);

  return {
    account,
    activeProvider,
    isConnecting,
    error,
    connect,
    disconnect,
    adapters: Object.values(ADAPTERS),
  };
}
