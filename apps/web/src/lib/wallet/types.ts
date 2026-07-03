import type { OfflineSigner } from "@cosmjs/proto-signing";

export type GnoWalletProviderId = "mock" | "adena";
export type CosmosWalletProviderId = "keplr" | "leap" | "cosmostation";
export type WalletProviderId = GnoWalletProviderId | CosmosWalletProviderId;

export type WalletEcosystem = "gno" | "cosmos";
export type WalletSupportLevel = "live" | "preview" | "planned" | "disabled";

export interface GnoWalletAccount {
  address: string;
  displayAddress: string;
  name?: string;
  chainId?: string;
  chainName?: string;
  providerLabel?: string;
  supportLevel?: WalletSupportLevel;
  publicKeyHex?: string;
  explorerAddressUrl?: string;
  mockUser?: "A" | "B";
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
  /** resolved IBC transfer path + base denom, e.g. "transfer/channel-0/uosmo" */
  ibcTrace?: string;
  /** base denom behind an ibc/ hash denom, e.g. "uosmo" */
  baseDenom?: string;
  ownerAddress?: string;
  ownerLabel?: string;
  ownerProvider?: WalletProviderId;
  ownerKey?: string;
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
  chainId?: string;
  networkId?: string;
  publicKey?: string;
}

export interface AdenaContractRequest {
  messages: unknown[];
  gasFee?: number;
  gasWanted?: number;
  memo?: string;
}

export interface AdenaResponse {
  status?: "success" | "failure";
  message?: string;
  data?: {
    hash?: string;
  };
  hash?: string;
}

/**
 * Adena GetAccount historically returned the account fields flat; current
 * Adena versions wrap them in `{ code, status, message, data: {...} }`.
 * We accept both shapes and normalize in the adapter.
 */
export interface AdenaGetAccountResponse extends AdenaAccountInfo {
  code?: number;
  status?: "success" | "failure";
  message?: string;
  data?: AdenaAccountInfo;
}

export interface AdenaProvider {
  AddEstablish(appName: string): Promise<AdenaResponse | void>;
  GetAccount(): Promise<AdenaGetAccountResponse>;
  DoContract?(request: AdenaContractRequest): Promise<AdenaResponse>;
}

/** Keplr-compatible provider API (implemented by Keplr, Leap and Cosmostation's compat layer). */
export interface KeplrLikeProvider {
  enable(chainIds: string | string[]): Promise<void>;
  experimentalSuggestChain?(chainConfig: unknown): Promise<void>;
  getOfflineSigner(chainId: string): OfflineSigner;
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
