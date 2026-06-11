import { VerificationStatus } from './verification';

export type AssetType = 'coin' | 'nft' | 'unknown';

export interface TradeAsset {
  id: string;
  type: AssetType;
  chainId: string;
  sourceChain: string;
  displayDenom: string;
  baseDenom: string;
  technicalDenom: string;
  amount: string;
  decimals: number;
  ibcTrace: string;
  verificationStatus: VerificationStatus;
  verificationReason: string;
  metadata: string;
}

export const DEMO_ASSETS: TradeAsset[] = [
  {
    id: "demo-1",
    type: "coin",
    chainId: "atomone-1",
    sourceChain: "AtomOne",
    displayDenom: "AON",
    baseDenom: "uatomone",
    technicalDenom: "uatomone",
    amount: "1500",
    decimals: 6,
    ibcTrace: "",
    verificationStatus: "verified",
    verificationReason: "Native token on source chain",
    metadata: "{}"
  },
  {
    id: "demo-2",
    type: "coin",
    chainId: "gno-1",
    sourceChain: "Gno.land",
    displayDenom: "GNOT",
    baseDenom: "ugnot",
    technicalDenom: "ugnot",
    amount: "5000",
    decimals: 6,
    ibcTrace: "",
    verificationStatus: "verified",
    verificationReason: "Native token on Gno.land",
    metadata: "{}"
  },
  {
    id: "demo-3",
    type: "coin",
    chainId: "atomone-1",
    sourceChain: "Unknown",
    displayDenom: "USDC",
    baseDenom: "uusdc",
    technicalDenom: "ibc/ED07...4B1",
    amount: "2000",
    decimals: 6,
    ibcTrace: "transfer/channel-99/uusdc",
    verificationStatus: "suspicious",
    verificationReason: "Display denom does not match verified IBC origin",
    metadata: "{}"
  }
];
