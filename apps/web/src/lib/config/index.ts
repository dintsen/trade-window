import { featureFlags } from "./feature-flags";

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || null,
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || null,
  isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
  ...featureFlags,
};

export { featureFlags, TRANSFERS_DISABLED_MESSAGE } from "./feature-flags";
