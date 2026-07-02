export interface PublicBoardListing {
  id: string;
  createdAt: string;
  expiresAt: string;
  status: string;
  title: string;
  requestType: string;
  offerAsset: string;
  wantAsset: string;
  amountRange?: string;
  chain: string;
  publicMessage?: string;
  publicContact?: string;
  contactMethod?: string;
}

export interface BoardListingDraft {
  title: string;
  requestType: string;
  offerAsset: string;
  wantAsset: string;
  amountRange: string;
  chain: string;
  publicMessage: string;
  publicContact: string;
  contactMethod: string;
  privateEmail: string;
  privateName: string;
  creatorWallet?: string;
  consentAccepted: boolean;
}
