"use client";

import { useState } from "react";
import Image from "next/image";
import { Copy, Check } from "lucide-react";
import { DonationWallet } from "@/lib/support/donations";

const SYMBOL_LOGO: Record<string, string> = {
  ATOM: "/assets/logos/cosmos.svg",
  ATONE: "/assets/logos/atomone.svg",
};

export function DonationCard({ wallet }: { wallet: DonationWallet }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — select-friendly fallback
      const el = document.createElement("textarea");
      el.value = wallet.address;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 min-w-0 bg-[#0a0a0c] border border-white/10 hover:border-emerald-500/20 rounded-2xl p-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center overflow-hidden">
            {SYMBOL_LOGO[wallet.symbol] ? (
              <Image src={SYMBOL_LOGO[wallet.symbol]} alt={wallet.symbol} width={28} height={28} className="object-contain" />
            ) : (
              <span className="font-bold text-emerald-400 text-sm">{wallet.symbol.slice(0, 2)}</span>
            )}
          </div>
          <div>
            <div className="font-semibold text-white">{wallet.symbol}</div>
            <div className="text-[11px] text-white/40">Donation address</div>
          </div>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-white/60 rounded-full">
          {wallet.chain}
        </span>
      </div>

      <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-3 py-2.5">
        <code className="flex-1 min-w-0 font-mono text-[11px] md:text-xs text-white/70 truncate" title={wallet.address}>
          {wallet.address}
        </code>
        <button
          onClick={handleCopy}
          aria-label={`Copy ${wallet.symbol} address`}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
            copied
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
