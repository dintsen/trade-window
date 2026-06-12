import { GnoWalletAccount, WalletAdapter } from "./types";

let currentAccount: GnoWalletAccount | null = null;
let currentDemoUser: "A" | "B" | null = null;

const MOCK_ACCOUNTS: Record<"A" | "B", GnoWalletAccount> = {
  A: {
    address: "gno1demoA9876543210qwertyuiop",
    displayAddress: "gno1...uiop (Demo A)",
    chainId: "gno-testnet",
    provider: "mock",
    isMock: true,
  },
  B: {
    address: "gno1demoB1234567890asdfghjkl",
    displayAddress: "gno1...hjkl (Demo B)",
    chainId: "gno-testnet",
    provider: "mock",
    isMock: true,
  },
};

export function setNextMockUser(user: "A" | "B") {
  currentDemoUser = user;
}

export const mockWalletAdapter: WalletAdapter = {
  id: "mock",
  label: "Mock Wallet",
  isAvailable: () => true,
  connect: async () => {
    // Determine which demo user to assign
    const userToAssign = currentDemoUser || "A";
    currentAccount = MOCK_ACCOUNTS[userToAssign];
    return currentAccount;
  },
  disconnect: async () => {
    currentAccount = null;
    currentDemoUser = null;
  },
  getAccount: async () => {
    return currentAccount;
  },
};
