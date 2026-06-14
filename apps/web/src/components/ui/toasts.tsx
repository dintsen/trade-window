'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, XCircle, AlertTriangle, Info, Loader2, X, ExternalLink,
} from 'lucide-react';
import {
  ToastEntry, _registerListeners,
} from '@/hooks/use-toasts';

const ICON_MAP = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  pending: Loader2,
} as const;

const COLOR_MAP = {
  success: { icon: 'text-[#3ECF8E]', border: 'rgba(62,207,142,0.2)', glow: 'rgba(62,207,142,0.05)' },
  error:   { icon: 'text-red-400',   border: 'rgba(239,68,68,0.25)',  glow: 'rgba(239,68,68,0.05)' },
  warning: { icon: 'text-amber-400', border: 'rgba(245,158,11,0.25)', glow: 'rgba(245,158,11,0.04)' },
  info:    { icon: 'text-sky-400',   border: 'rgba(14,165,233,0.25)', glow: 'rgba(14,165,233,0.04)' },
  pending: { icon: 'text-white/40',  border: 'rgba(255,255,255,0.08)',glow: 'transparent' },
} as const;

function ToastItem({ entry, onDismiss }: { entry: ToastEntry; onDismiss: () => void }) {
  const Icon = ICON_MAP[entry.type];
  const color = COLOR_MAP[entry.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-2xl w-[340px] max-w-[calc(100vw-3rem)]"
      style={{
        background: 'rgba(10,10,10,0.97)',
        borderColor: color.border,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 0 24px ${color.glow}`,
        backdropFilter: 'blur(20px)',
      }}
    >
      <Icon
        size={15}
        className={`${color.icon} shrink-0 mt-0.5 ${entry.type === 'pending' ? 'animate-spin' : ''}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-white leading-snug">{entry.title}</p>
        {entry.message && (
          <p className="text-[11px] text-white/45 mt-0.5 leading-relaxed">{entry.message}</p>
        )}
        {entry.txHash && (
          <a
            href={entry.explorerUrl ?? '#'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-mono text-[#3ECF8E]/70 hover:text-[#3ECF8E] mt-1 transition-colors"
          >
            {entry.txHash.slice(0, 10)}…{entry.txHash.slice(-8)}
            <ExternalLink size={9} />
          </a>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="text-white/20 hover:text-white/60 transition-colors shrink-0 mt-0.5 -mr-0.5"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const [entries, setEntries] = useState<ToastEntry[]>([]);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  const scheduleAutoDismiss = useCallback((entry: ToastEntry) => {
    if (entry.duration && entry.duration > 0) {
      const t = setTimeout(() => {
        setEntries(prev => prev.filter(e => e.id !== entry.id));
        timers.delete(entry.id);
      }, entry.duration);
      timers.set(entry.id, t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const unsub = _registerListeners(
      (entry) => {
        setEntries(prev => [...prev, entry]);
        scheduleAutoDismiss(entry);
      },
      (id, patch) => {
        setEntries(prev =>
          prev.map(e => {
            if (e.id !== id) return e;
            const updated = { ...e, ...patch };
            // reschedule dismiss if duration changed
            const old = timers.get(id);
            if (old) clearTimeout(old);
            scheduleAutoDismiss(updated);
            return updated;
          })
        );
      },
      (id) => {
        const t = timers.get(id);
        if (t) { clearTimeout(t); timers.delete(id); }
        setEntries(prev => prev.filter(e => e.id !== id));
      },
    );
    return () => {
      unsub();
      timers.forEach(t => clearTimeout(t));
    };
  }, [scheduleAutoDismiss]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {entries.map(e => (
          <div key={e.id} className="pointer-events-auto">
            <ToastItem
              entry={e}
              onDismiss={() => setEntries(prev => prev.filter(x => x.id !== e.id))}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
