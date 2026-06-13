import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FinalCtaSection() {
  return (
    <section className="relative w-full py-32 bg-[#050505] border-t border-[#1c1c1c] overflow-hidden">
      {/* Single centered glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#3ECF8E]/6 rounded-[100%] blur-[100px] pointer-events-none" />

      <div className="relative max-w-[760px] mx-auto px-6 text-center z-10">

        <p className="text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-6">Demo</p>

        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-5 text-white">
          Open the mocked<br className="hidden md:block" /> trade-room demo.
        </h2>

        <p className="text-base md:text-lg text-white/40 leading-relaxed mb-10 max-w-xl mx-auto">
          Try the two-window flow: create a room, add assets, lock both sides, trigger the countdown and inspect the final intent hash.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
          <Link
            href="/trade"
            className="px-8 py-3.5 bg-[#3ECF8E] hover:bg-[#4ADBA0] text-black font-semibold rounded-lg text-sm transition-all flex items-center justify-center gap-2 group"
          >
            Open Trade Room
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/board"
            className="px-8 py-3.5 bg-transparent border border-[#2b2b2b] hover:border-[#3b3b3b] hover:bg-white/[0.03] text-white font-medium rounded-lg text-sm transition-all flex items-center justify-center"
          >
            Browse OTC Board
          </Link>
        </div>

        <p className="text-xs font-mono text-white/20">
          Mocked local MVP. Real wallet signing and settlement are not implemented yet.
        </p>
      </div>
    </section>
  );
}
