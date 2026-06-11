import React from 'react';
import Link from 'next/link';
import { ArrowRight, Info } from 'lucide-react';

export function FinalCtaSection() {
  return (
    <section className="relative w-full py-32 bg-[#050505] border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-[100%] blur-[100px] pointer-events-none"></div>
      
      <div className="relative max-w-[800px] mx-auto px-6 text-center z-10">
        
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-6 text-white">
          Open the mocked <br className="hidden md:block" />trade-room demo.
        </h2>
        
        <p className="text-lg md:text-xl text-white/40 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
          Try the two-window flow: create a room, add assets, lock both sides, trigger the countdown and inspect the final intent hash.
        </p>

        <div className="flex flex-col items-center gap-6">
          <Link 
            href="/trade" 
            className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full text-lg transition-all flex items-center gap-2 group shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            Launch Demo
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="flex items-center gap-2 text-xs font-mono text-white/30 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <Info size={14} />
            Mocked local MVP. Real wallet signing and settlement are not implemented yet.
          </div>
        </div>

      </div>
    </section>
  );
}
