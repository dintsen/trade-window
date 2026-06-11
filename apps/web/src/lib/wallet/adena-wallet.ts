import { WalletAdapter } from "./types";

export const adenaWalletAdapter: WalletAdapter = {
  id: "adena",
  ecosystem: "gno",
  label: "Adena",
  isAvailable: () => typeof window !== 'undefined' && !!window.adena,
  connect: async () => {
    if (!window.adena) {
      throw new Error("Adena not detected. Please install the Adena extension.");
    }
    try {
      await window.adena.AddEstablish("Trade Window");
      const accountInfo = await window.adena.GetAccount();
      
      return {
        address: accountInfo.address,
        displayAddress: "Adena User",
        chainId: "gno-testnet",
        source: "adena",
        ecosystem: "gno",
        isMock: false
      };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error("Adena connection research pending: " + (msg || "Failed to connect to Adena"));
    }
  },
  disconnect: async () => {
    // Read-only prototype; disconnecting just drops the state in our app
  },
  getAccount: async () => {
    if (!window.adena) return null;
    try {
      const accountInfo = await window.adena.GetAccount();
      return {
        address: accountInfo.address,
        displayAddress: "Adena User",
        chainId: "gno-testnet",
        source: "adena",
        ecosystem: "gno",
        isMock: false
      };
    } catch {
      return null;
    }
  },
};
