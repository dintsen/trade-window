import { GnoWalletAccount, WalletAdapter } from "./types";
import { CHAIN_NAMES, EXPLORER_ADDRESS } from "./chain-configs";

function getAdenaProvider() {
  if (typeof window === "undefined") return null;
  return window.adena ?? null;
}

export const adenaWalletAdapter: WalletAdapter = {
  id: "adena",
  label: "Adena Wallet",
  ecosystem: "gno",
  supportLevel: "preview",
  isAvailable: () => getAdenaProvider() !== null,
  
  connect: async (): Promise<GnoWalletAccount> => {
    const adena = getAdenaProvider();
    if (!adena) {
      throw new Error("Adena not detected. Please install the Adena extension.");
    }
    try {
      await adena.AddEstablish("Trade Window");
      const accountInfo = await adena.GetAccount();
      if (!accountInfo.address) {
        throw new Error("Adena did not return an address.");
      }
      
      const reportedChainId = accountInfo.chainId || "gno-testnet";
      return {
        address: accountInfo.address,
        displayAddress: accountInfo.address.slice(0, 10) + "…" + accountInfo.address.slice(-4),
        name: accountInfo.name,
        chainId: reportedChainId,
        chainName: CHAIN_NAMES[reportedChainId] ?? reportedChainId,
        providerLabel: "Adena Wallet",
        supportLevel: "preview",
        publicKeyHex: accountInfo.publicKey,
        explorerAddressUrl: EXPLORER_ADDRESS["gno-testnet"]?.(accountInfo.address),
        ecosystem: "gno" as const,
        provider: "adena",
        isMock: false
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error("Failed to connect to Adena: " + msg);
    }
  },
  
  disconnect: async (): Promise<void> => {
    // Read-only prototype; disconnecting just drops the state in our app
  },
  
  getAccount: async (): Promise<GnoWalletAccount | null> => {
    const adena = getAdenaProvider();
    if (!adena) return null;
    try {
      // In a real app we might need to check if we are established first.
      // But for prototype, we just attempt GetAccount
      const accountInfo = await adena.GetAccount();
      if (!accountInfo || !accountInfo.address) return null;

      const reportedChainId = accountInfo.chainId || "gno-testnet";
      return {
        address: accountInfo.address,
        displayAddress: accountInfo.address.slice(0, 10) + "…" + accountInfo.address.slice(-4),
        name: accountInfo.name,
        chainId: reportedChainId,
        chainName: CHAIN_NAMES[reportedChainId] ?? reportedChainId,
        providerLabel: "Adena Wallet",
        supportLevel: "preview",
        publicKeyHex: accountInfo.publicKey,
        explorerAddressUrl: EXPLORER_ADDRESS["gno-testnet"]?.(accountInfo.address),
        ecosystem: "gno" as const,
        provider: "adena",
        isMock: false
      };
    } catch {
      return null;
    }
  },
};
