export const config = {
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || null,
  isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
};
