export interface HistoryItem {
  type: string;
  id: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  assetPair?: string;
  amount?: string;
  counterparty?: string;
  txHash?: string;
  commitmentHash?: string;
}
