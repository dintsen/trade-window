import { config } from "../config";

export interface DealRequestDraft {
  name: string;
  email: string;
  contactHandle: string;
  preferredContact: string;
  requestType: string;
  chain: string;
  offerAsset: string;
  wantAsset: string;
  amountRange: string;
  message: string;
  consentAccepted: boolean;
}

export interface DealRequestResponse {
  id: string;
  status: string;
}

function getApiUrl(): string {
  if (!config.apiUrl) {
    throw new Error("Backend API URL is not configured. Set NEXT_PUBLIC_API_URL.");
  }
  return config.apiUrl;
}

export async function createDealRequest(draft: DealRequestDraft): Promise<DealRequestResponse> {
  const res = await fetch(`${getApiUrl()}/api/deal-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(draft),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to submit deal request");
  }
  return res.json();
}
