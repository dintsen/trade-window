export type GnoWalletProviderId = "mock" | "adena";
export type CosmosWalletProviderId = "keplr" | "leap" | "cosmostation";
export type WalletProviderId = GnoWalletProviderId | CosmosWalletProviderId;

export type WalletEcosystem = "gno" | "cosmos";
export type WalletSupportLevel = "live" | "preview" | "planned" | "disabled";

export interface GnoWalletAccount {
  address: string;
  displayAddress: string;
  chainId?: string;
  provider: WalletProviderId;
  ecosystem?: WalletEcosystem;
  isMock: boolean;
}

/** Canonical account type; Gno name kept for backward compatibility. */
export type WalletAccount = GnoWalletAccount;

export interface WalletBalance {
  denom: string;
  amount: string; // base units as string
  symbol?: string;
  decimals?: number;
  chainId: string;
}

export interface WalletNft {
  chain: string;
  collectionAddr: string;
  collectionName: string;
  tokenId: string;
  name?: string;
  imageUrl?: string;
}

export interface WalletAdapter {
  id: WalletProviderId;
  label: string;
  ecosystem: WalletEcosystem;
  supportLevel: WalletSupportLevel;
  isAvailable(): boolean;
  connect(chainId?: string): Promise<WalletAccount>;
  getAccount(chainId?: string): Promise<WalletAccount | null>;
  disconnect(): Promise<void>;
}

export interface AdenaAccountInfo {
  address?: string;
  name?: string;
}

export interface AdenaContractRequest {
  messages: unknown[];
  gasFee?: number;
  gasWanted?: number;
  memo?: string;
}

export interface AdenaProvider {
  AddEstablish(appName: string): Promise<void>;
  GetAccount(): Promise<AdenaAccountInfo>;
  DoContract?(request: AdenaContractRequest): Promise<unknown>;
}

/** Keplr-compatible provider API (implemented by Keplr, Leap and Cosmostation's compat layer). */
export interface KeplrLikeProvider {
  enable(chainIds: string | string[]): Promise<void>;
  getKey(chainId: string): Promise<{
    name: string;
    bech32Address: string;
    pubKey?: Uint8Array;
  }>;
}

interface CosmostationProvider {
  providers?: {
    keplr?: KeplrLikeProvider;
  };
}

declare global {
  interface Window {
    adena?: AdenaProvider;
    keplr?: KeplrLikeProvider;
    leap?: KeplrLikeProvider;
    cosmostation?: CosmostationProvider;
  }
}
