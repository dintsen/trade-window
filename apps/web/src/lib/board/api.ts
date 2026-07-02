import { BoardListingDraft, PublicBoardListing } from "./types";
import { config } from "../config";

function getApiUrl(): string {
  if (!config.apiUrl) {
    throw new Error("Backend API URL is not configured. Set NEXT_PUBLIC_API_URL.");
  }
  return config.apiUrl;
}

export async function fetchListings(): Promise<PublicBoardListing[]> {
  const res = await fetch(`${getApiUrl()}/api/board/listings`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error("Failed to fetch listings");
  }
  return res.json();
}

export async function createListing(draft: BoardListingDraft): Promise<PublicBoardListing> {
  const res = await fetch(`${getApiUrl()}/api/board/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(draft),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create listing");
  }
  return res.json();
}
