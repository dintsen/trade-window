import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldAlert } from 'lucide-react';

const MOCK_LISTINGS = [
  { title: "Looking to swap ATONE", type: "Swap", offer: "10,000 PHOTON", want: "ATONE", chain: "AtomOne" },
  { title: "Selling rare NFT collection", type: "NFT / RWA", offer: "3 NFTs", want: "500 GNOT", chain: "Gno.land" },
  { title: "Buying USDC with GNOT", type: "Buy", offer: "1,000 GNOT", want: "USDC", chain: "Gno.land" },
];

export function OtcBoardSection() {
  return (
    <section className="relative w-full py-24 bg-[#0a0a0a] border-t border-[#1c1c1c] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">

        {/* Left: Content */}
        <div className="flex-1 space-y-6">
          <div>
            <p className="text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-4">Public OTC Board</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-5 text-white leading-tight">
              Discover negotiated deal intents
            </h2>
            <p className="text-base text-white/50 leading-relaxed mb-6">
              The OTC Board helps users discover public deal intents before moving into manual coordination or a structured trade room.
            </p>
            <div className="flex items-start gap-3 bg-[#1a0000] border border-rose-500/15 rounded-lg p-4 text-rose-300/70 text-sm leading-relaxed">
              <ShieldAlert size={16} className="shrink-0 text-rose-500/50 mt-0.5" />
              <div>
                Listings are public deal intents only. Trade Window does not custody assets, execute trades, provide financial advice or guarantee settlement.
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/board"
              className="px-6 py-3 bg-[#3ECF8E] hover:bg-[#4ADBA0] text-black font-semibold rounded-lg transition-all text-center text-sm"
            >
              Browse OTC Board
            </Link>
            <Link
              href="/board/new"
              className="px-6 py-3 bg-transparent border border-[#2b2b2b] hover:border-[#3b3b3b] hover:bg-white/[0.03] text-white font-medium rounded-lg transition-all text-center text-sm"
            >
              Post a Deal
            </Link>
          </div>

          <div className="text-sm text-white/40">
            Want manual help instead?{' '}
            <Link href="/request" className="text-[#3ECF8E] hover:underline">Submit Private Request</Link>
          </div>
        </div>

        {/* Right: Mock Board */}
        <div className="flex-1 w-full">
          <div className="bg-[#0c0c0c] border border-[#1c1c1c] rounded-xl overflow-hidden shadow-2xl">
            {/* Table header */}
            <div className="flex items-center px-4 py-2.5 border-b border-[#1c1c1c] bg-[#0a0a0a]">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.12em] w-1/3">Title</span>
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.12em] flex-1">Offer → Want</span>
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.12em]">Chain</span>
            </div>
            {MOCK_LISTINGS.map((mock, i) => (
              <div
                key={i}
                className={`flex items-center px-4 py-3.5 gap-4 transition-colors hover:bg-[#111111] ${
                  i < MOCK_LISTINGS.length - 1 ? 'border-b border-[#1c1c1c]' : ''
                }`}
              >
                {/* Title + type */}
                <div className="w-1/3 min-w-0">
                  <p className="text-sm font-medium text-white/80 truncate mb-1">{mock.title}</p>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#1a1a1a] border border-[#2b2b2b] text-white/40 rounded">
                    {mock.type}
                  </span>
                </div>
                {/* Assets */}
                <div className="flex-1 flex items-center gap-2 text-sm">
                  <span className="text-white/60 font-medium">{mock.offer}</span>
                  <ArrowRight size={12} className="text-white/20 shrink-0" />
                  <span className="text-white/60 font-medium">{mock.want}</span>
                </div>
                {/* Chain */}
                <span className="text-[10px] font-mono text-[#3ECF8E]/60 shrink-0">{mock.chain}</span>
              </div>
            ))}
            {/* Fade */}
            <div className="h-8 bg-gradient-to-t from-[#0c0c0c] to-transparent flex items-end justify-center pb-2">
              <span className="text-[10px] text-white/20 font-mono">Example listings</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
