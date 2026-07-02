import { GnoWalletAccount, WalletAdapter } from "./types";
import { CHAIN_NAMES } from "./chain-configs";

let currentAccount: GnoWalletAccount | null = null;
let currentDemoUser: "A" | "B" | null = null;

const MOCK_ACCOUNTS: Record<"A" | "B", GnoWalletAccount> = {
  A: {
    address: "gno1demoA9876543210qwertyuiop",
    displayAddress: "gno1...uiop (Demo A)",
    name: "Demo User A",
    chainId: "gno-testnet",
    chainName: CHAIN_NAMES["gno-testnet"],
    providerLabel: "Mock Wallet",
    supportLevel: "live",
    provider: "mock",
    ecosystem: "gno",
    isMock: true,
    mockUser: "A",
  },
  B: {
    address: "gno1demoB1234567890asdfghjkl",
    displayAddress: "gno1...hjkl (Demo B)",
    name: "Demo User B",
    chainId: "gno-testnet",
    chainName: CHAIN_NAMES["gno-testnet"],
    providerLabel: "Mock Wallet",
    supportLevel: "live",
    provider: "mock",
    ecosystem: "gno",
    isMock: true,
    mockUser: "B",
  },
};

export function setNextMockUser(user: "A" | "B") {
  currentDemoUser = user;
}

export const mockWalletAdapter: WalletAdapter = {
  id: "mock",
  label: "Mock Wallet",
  ecosystem: "gno",
  supportLevel: "live",
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
