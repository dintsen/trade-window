import { TradeAsset } from './assets';

export interface TradeIntent {
  intentId: string;
  version: string;
  roomId: string;
  chainId: string;
  partyA: string;
  partyB: string;
  offerA: TradeAsset[];
  offerB: TradeAsset[];
  fee: string;
  feeToken: string;
  createdAt: string;
  expiresAt: string;
  nonce: string;
  status: string;
}
