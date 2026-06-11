import React from 'react';
import Link from 'next/link';
import { ArrowRight, List, Lock, FileSearch, ShieldAlert } from 'lucide-react';

export function OtcBoardSection() {
  return (
    <section className="relative w-full py-24 bg-[#0a0a0a] border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-6">
              <List size={14} /> Public OTC Board
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-6 text-white leading-tight">
              Discover negotiated deal intents
            </h2>
            <p className="text-lg text-white/50 font-light leading-relaxed mb-6">
              The OTC Board helps users discover public deal intents before moving into manual coordination or a structured trade room.
            </p>
            <div className="flex items-start gap-3 bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 text-rose-300/80 text-sm leading-relaxed">
              <ShieldAlert size={20} className="shrink-0 text-rose-500/60" />
              <div>
                Listings are public deal intents only. Trade Window does not custody assets, execute trades, provide financial advice or guarantee settlement.
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/board" className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] text-center">
              Browse OTC Board
            </Link>
            <Link href="/board/new" className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 rounded-xl transition-all text-center">
              Post a Deal
            </Link>
          </div>
          
          <div className="text-sm text-white/40">
            Want manual help instead? <Link href="/request" className="text-emerald-400 hover:underline">Submit Private Request</Link>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent blur-3xl opacity-30 rounded-full"></div>
          <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex flex-col gap-4">
              {[
                { title: "Looking to swap AON", type: "Swap", offer: "10,000 USDC", want: "AON", chain: "AtomOne" },
                { title: "Selling rare NFT collection", type: "NFT_Game_RWA", offer: "3 NFTs", want: "500 GNOT", chain: "Gno.land" },
                { title: "Buying USDC with GNOT", type: "Buy", offer: "1,000 GNOT", want: "USDC", chain: "Gno.land" },
              ].map((mock, i) => (
                <div key={i} className="bg-black/50 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-white font-medium mb-2 text-sm">{mock.title}</h4>
                    <div className="flex gap-2 text-[10px]">
                      <span className="px-2 py-1 bg-white/10 rounded uppercase">{mock.type.replace(/_/g, " ")}</span>
                      <span className="px-2 py-1 bg-white/5 rounded">{mock.chain}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex flex-col items-end">
                      <span className="text-white/40 uppercase tracking-wider text-[9px] mb-0.5">Offer</span>
                      <span className="text-white/90 font-medium">{mock.offer}</span>
                    </div>
                    <ArrowRight size={12} className="text-white/20" />
                    <div className="flex flex-col items-start">
                      <span className="text-white/40 uppercase tracking-wider text-[9px] mb-0.5">Want</span>
                      <span className="text-white/90 font-medium">{mock.want}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#111] to-transparent pointer-events-none rounded-b-2xl flex items-end justify-center pb-6">
              <span className="text-xs text-white/40 font-medium">Example Listings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
