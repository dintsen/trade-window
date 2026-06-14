/**
 * Lightweight singleton toast system.
 * ToastContainer registers itself as the listener; anywhere in the app
 * can call `toast({ type, title, ... })` without prop-drilling.
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'pending';

export interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  /** Short tx hash shown as a link */
  txHash?: string;
  /** Full explorer URL for the tx */
  explorerUrl?: string;
  /** Auto-dismiss after ms. 0 = persist until manually closed. Default: 5000 (pending=0) */
  duration?: number;
}

export interface ToastEntry extends ToastOptions {
  id: string;
}

type Listener = (entry: ToastEntry) => void;
type UpdateListener = (id: string, patch: Partial<ToastOptions>) => void;
type DismissListener = (id: string) => void;

const addListeners = new Set<Listener>();
const updateListeners = new Set<UpdateListener>();
const dismissListeners = new Set<DismissListener>();
let counter = 0;

/** Show a new toast. Returns the id so you can update/dismiss it later. */
export function toast(opts: ToastOptions): string {
  const id = String(++counter);
  const entry: ToastEntry = {
    ...opts,
    id,
    duration: opts.duration ?? (opts.type === 'pending' ? 0 : 5000),
  };
  addListeners.forEach(fn => fn(entry));
  return id;
}

/** Update an existing toast by id (e.g., pending → success after tx confirms). */
export function updateToast(id: string, patch: Partial<ToastOptions>): void {
  updateListeners.forEach(fn => fn(id, patch));
}

/** Dismiss a toast programmatically. */
export function dismissToast(id: string): void {
  dismissListeners.forEach(fn => fn(id));
}

/** Used internally by ToastContainer to register itself. */
export function _registerListeners(
  onAdd: Listener,
  onUpdate: UpdateListener,
  onDismiss: DismissListener,
) {
  addListeners.add(onAdd);
  updateListeners.add(onUpdate);
  dismissListeners.add(onDismiss);
  return () => {
    addListeners.delete(onAdd);
    updateListeners.delete(onUpdate);
    dismissListeners.delete(onDismiss);
  };
}
