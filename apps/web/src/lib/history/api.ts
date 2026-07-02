import { config } from "../config";
import { HistoryItem } from "./types";

function getApiUrl(): string {
  if (!config.apiUrl) {
    throw new Error("Backend API URL is not configured. Set NEXT_PUBLIC_API_URL.");
  }
  return config.apiUrl;
}

export async function fetchMyTrades(wallet: string): Promise<HistoryItem[]> {
  const res = await fetch(`${getApiUrl()}/api/me/trades?wallet=${encodeURIComponent(wallet)}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error("Failed to fetch history");
  }
  return res.json();
}
