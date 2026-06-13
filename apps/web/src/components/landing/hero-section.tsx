import React from 'react';
import Link from 'next/link';
import { AnimatedTag } from './animated-tag';
import Image from 'next/image';
import { ArrowRight, ShieldAlert, Lock, Info } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden bg-[#030303]">
      {/* Single centered radial glow — subtle, Supabase-style */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#3ECF8E]/8 rounded-[100%] blur-[120px] pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left: Text Content */}
        <div className="flex flex-col items-start text-left z-10">
          <div className="flex flex-col items-start mb-8">
            <AnimatedTag />
          </div>

          {/* Section label */}
          <p className="text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-4">
            Safety-first OTC · AtomOne / Gno.land
          </p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6 text-white">
            OTC trading room for{' '}
            <span className="text-[#3ECF8E]">digital assets.</span>
          </h1>

          <p className="text-base md:text-lg text-white/50 leading-relaxed font-light mb-10 max-w-lg">
            Trade Window helps two parties build, inspect and lock custom asset deals before signing — from tokens and NFTs to future tokenized assets and interchain bundles.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/request"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#3ECF8E] hover:bg-[#4ADBA0] text-black font-semibold rounded-lg transition-all flex items-center justify-center gap-2 group text-sm"
            >
              Request a Deal
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/trade"
              className="w-full sm:w-auto px-7 py-3.5 bg-transparent border border-[#2b2b2b] hover:border-[#3b3b3b] hover:bg-white/[0.03] text-white font-medium rounded-lg transition-all text-center text-sm"
            >
              Launch Demo Room
            </Link>
          </div>

          {/* Disclaimer chip */}
          <div className="mt-6 flex items-center gap-2 text-[11px] text-white/30 font-mono">
            <Info size={12} className="text-white/20" />
            MVP prototype — mainnet settlement disabled
          </div>
        </div>

        {/* Right: Floating Product Mockup */}
        <div className="relative w-full lg:h-[540px] z-10">
          <div className="relative w-full h-full bg-[#0c0c0c] rounded-xl border border-[#1c1c1c] shadow-2xl flex flex-col font-sans overflow-hidden">

            {/* Mockup Header */}
            <div className="h-10 border-b border-[#1c1c1c] bg-[#0a0a0a] flex items-center px-4 justify-between">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1c]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1c]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1c]" />
              </div>
              <div className="text-[10px] text-white/30 font-mono bg-[#111] px-2 py-0.5 rounded border border-[#1c1c1c]">trade-window/demo</div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#3ECF8E]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]" />
                Connected
              </div>
            </div>

            {/* Mockup Body */}
            <div className="flex-1 p-4 grid grid-cols-2 gap-4 relative">
              {/* User A Panel */}
              <div className="bg-[#111111] border border-[#1c1c1c] rounded-lg p-4 flex flex-col relative">
                <div className="absolute inset-0 border border-[#3ECF8E]/20 rounded-lg pointer-events-none" />
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-white/70 font-medium">User A</span>
                  <div className="flex items-center gap-1 text-[10px] text-[#3ECF8E] bg-[#3ECF8E]/10 px-2 py-0.5 rounded border border-[#3ECF8E]/20">
                    <Lock size={9} /> Locked
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-3.5 flex items-center justify-between mb-2 border border-[#1c1c1c]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-[#1a1a1a] flex items-center justify-center p-1.5 border border-[#2b2b2b]">
                      <Image src="/assets/logos/atomone.svg" alt="AtomOne" width={22} height={22} className="object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-bold text-white">1,500.00</div>
                      <div className="text-[10px] text-white/40 font-mono">uatomone</div>
                    </div>
                  </div>
                  <Info size={13} className="text-white/20" />
                </div>
              </div>

              {/* User B Panel */}
              <div className="bg-[#111111] border border-[#1c1c1c] rounded-lg p-4 flex flex-col relative">
                <div className="absolute inset-0 border border-[#3ECF8E]/20 rounded-lg pointer-events-none" />
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-white/70 font-medium">User B</span>
                  <div className="flex items-center gap-1 text-[10px] text-[#3ECF8E] bg-[#3ECF8E]/10 px-2 py-0.5 rounded border border-[#3ECF8E]/20">
                    <Lock size={9} /> Locked
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-3.5 flex items-center justify-between mb-2 border border-rose-500/20 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-rose-500" />
                  <div className="flex items-center gap-3 pl-1">
                    <div className="w-9 h-9 rounded-md bg-[#1a1a1a] flex items-center justify-center p-1.5 border border-rose-500/20">
                      <Image src="/assets/logos/usdc.svg" alt="USDC" width={22} height={22} className="object-contain" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-bold text-white">5,000.00</div>
                      <div className="text-[10px] text-rose-400 flex items-center gap-1 font-medium mt-0.5">
                        <ShieldAlert size={9} /> Suspicious denom
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intent Hash Preview overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0a0a0a] border border-[#3ECF8E]/25 rounded-lg p-4 shadow-2xl flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-white/50">Final Intent Hash</span>
                  <span className="text-[10px] text-[#3ECF8E] font-mono flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-[#3ECF8E] animate-pulse" />
                    10s remaining
                  </span>
                </div>
                <div className="text-xs font-mono text-[#3ECF8E] bg-[#3ECF8E]/8 px-3 py-2.5 rounded-md break-all border border-[#3ECF8E]/20 text-center">
                  0x8f2a7b931dc240...9c4e21
                </div>
                <div className="w-full bg-white/[0.04] text-white/30 text-xs py-2.5 rounded-md text-center border border-[#1c1c1c] font-medium">
                  Sign &amp; Settle (Disabled in Demo)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Logos */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 mt-20 pt-10 border-t border-[#1c1c1c]">
        <div className="flex flex-col items-center justify-center gap-6">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em]">Building for the Ecosystem</p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {[
              { src: '/assets/logos/atomone.svg', alt: 'AtomOne', label: 'AtomOne', w: 22 },
              { src: '/assets/logos/gno.svg', alt: 'Gno.land', label: null, w: 100 },
              { src: '/assets/logos/cosmos.svg', alt: 'Cosmos', label: 'Cosmos', w: 22 },
            ].map((eco) => (
              <div key={eco.alt} className="flex items-center gap-2.5 opacity-40 hover:opacity-80 transition-opacity duration-300 grayscale hover:grayscale-0">
                <Image src={eco.src} alt={eco.alt} width={eco.w} height={22} className="object-contain" />
                {eco.label && <span className="text-sm font-semibold text-white tracking-wide">{eco.label}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
