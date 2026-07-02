export interface DonationWallet {
  id: string;
  symbol: string;
  chain: string;
  address: string;
}

export const DONATION_WALLETS: DonationWallet[] = [
  {
    id: "atom",
    symbol: "ATOM",
    chain: "Cosmos Hub",
    address: "cosmos150tjx63plw3aeqq5uk5vajh3z393u5dr4n23dz",
  },
  {
    id: "atone",
    symbol: "ATONE",
    chain: "AtomOne",
    address: "atone150tjx63plw3aeqq5uk5vajh3z393u5drmnkkm6",
  },
];
