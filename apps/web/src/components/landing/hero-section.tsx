import React from 'react';
import Link from 'next/link';
import { AnimatedTag } from './animated-tag';
import Image from 'next/image';
import { ArrowRight, ShieldAlert, Lock, Info } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden bg-[#030303]">
      {/* Background glow effects - Animated blurred gradient */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse duration-[5000ms] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-emerald-800/20 rounded-full blur-[150px] animate-pulse duration-[7000ms] pointer-events-none delay-1000"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-10 pointer-events-none bg-center" style={{ backgroundSize: '40px' }}></div>

      <div className="relative max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Text Content */}
        <div className="flex flex-col items-start text-left z-10">
          <div className="flex flex-col items-start mb-8">
            <AnimatedTag />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6 text-white">
            OTC trading room for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">digital assets.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/40 leading-relaxed font-light mb-10 max-w-lg">
            Trade Window helps two parties build, inspect and lock custom asset deals before signing — from tokens and NFTs to future tokenized assets and interchain bundles.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link 
              href="/trade" 
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-full transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              Launch Demo
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#how-it-works" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/10 hover:border-white/30 hover:bg-white/5 text-white font-medium rounded-full transition-all text-center"
            >
              View Demo Flow
            </Link>
          </div>
        </div>

        {/* Right: Floating Product Mockup */}
        <div className="relative w-full lg:h-[600px] perspective-[1000px] z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-2xl blur-3xl transform rotate-12 scale-105 opacity-50"></div>
          
          <div className="relative w-full h-full bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl flex flex-col font-sans overflow-hidden transform md:rotate-y-[-5deg] md:rotate-x-[5deg] transition-transform hover:rotate-0 duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]">
            
            {/* Mockup Header */}
            <div className="h-10 border-b border-white/5 bg-black/40 flex items-center px-4 justify-between">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
              </div>
              <div className="text-[10px] text-white/30 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">trade-window/demo</div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                Connected
              </div>
            </div>

            {/* Mockup Body */}
            <div className="flex-1 p-4 grid grid-cols-2 gap-4 relative">
              {/* User A Panel */}
              <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col relative">
                <div className="absolute inset-0 border border-emerald-500/30 rounded-xl pointer-events-none"></div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-white/80">User A</span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <Lock size={10} /> Locked
                  </div>
                </div>
                
                <div className="bg-[#0a0a0a] rounded-xl p-4 flex items-center justify-between mb-2 border border-white/5 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center p-1.5 border border-emerald-500/20">
                      <Image src="/assets/logos/atomone.svg" alt="AtomOne" width={24} height={24} className="object-contain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base font-bold text-white tracking-wide">1,500.00</div>
                      <div className="text-[10px] text-white/40 font-mono">uatomone</div>
                    </div>
                  </div>
                  <Info size={14} className="text-white/20 hover:text-white/40 transition-colors cursor-help" />
                </div>
              </div>

              {/* User B Panel */}
              <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col relative">
                <div className="absolute inset-0 border border-emerald-500/30 rounded-xl pointer-events-none"></div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-white/80">User B</span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <Lock size={10} /> Locked
                  </div>
                </div>

                <div className="bg-[#0a0a0a] rounded-xl p-4 flex items-center justify-between mb-2 border border-rose-500/30 shadow-inner relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
                  <div className="flex items-center gap-3 pl-1">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center p-1.5 border border-rose-500/20">
                      <Image src="/assets/logos/usdc.svg" alt="USDC" width={24} height={24} className="object-contain drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base font-bold text-white tracking-wide">5,000.00</div>
                      <div className="text-[10px] text-rose-400 flex items-center gap-1 font-medium mt-0.5">
                        <ShieldAlert size={10} /> Suspicious denom
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mockup Overlay: Intent Hash Preview */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#0a0a0a] backdrop-blur-md border border-emerald-500/30 rounded-xl p-4 shadow-2xl flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-medium text-white/60">Final Intent Hash</span>
                  <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
                    10s remaining
                  </span>
                </div>
                <div className="text-sm font-mono text-emerald-400 bg-emerald-500/10 px-4 py-3 rounded-lg break-all border border-emerald-500/20 shadow-inner text-center">
                  0x8f2a7b931dc240...9c4e21
                </div>
                <div className="w-full bg-white/5 text-white/40 text-xs py-3 rounded-lg text-center border border-white/10 font-medium">
                  Sign & Settle (Disabled in Demo)
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Ecosystem Logos at the bottom of the hero */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 mt-20 pt-10 border-t border-white/5">
        <div className="flex flex-col items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <p className="text-xs font-mono text-white/40 tracking-widest uppercase">Building for the Ecosystem</p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/assets/logos/atomone.svg" alt="AtomOne" width={28} height={28} className="object-contain" />
              <span className="font-semibold text-white tracking-wide">AtomOne</span>
            </div>
            <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/assets/logos/gno.svg" alt="Gno.land" width={110} height={26} className="object-contain" />
            </div>
            <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all duration-300">
              <Image src="/assets/logos/cosmos.svg" alt="Cosmos" width={28} height={28} className="object-contain" />
              <span className="font-semibold text-white tracking-wide">Cosmos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
