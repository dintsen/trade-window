import { WalletAdapter } from "./types";

export const keplrWalletAdapter: WalletAdapter = {
  id: "keplr",
  ecosystem: "atomone",
  label: "Keplr",
  isAvailable: () => false, // TODO: Implement window.keplr check
  connect: async () => {
    throw new Error("Keplr integration planned. Not connected in MVP.");
  },
  disconnect: async () => {
    // Stub
  },
  getAccount: async () => {
    return null;
  },
};
