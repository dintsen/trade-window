'use client';

const STORAGE_KEY = 'trade-window-client-id';

export function getTradeClientId(): string {
  if (typeof window === 'undefined') return 'server-render';

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing && /^[a-zA-Z0-9_-]{8,128}$/.test(existing)) {
    return existing;
  }

  const generated = `tw_${crypto.randomUUID().replace(/-/g, '')}`;
  window.localStorage.setItem(STORAGE_KEY, generated);
  return generated;
}
