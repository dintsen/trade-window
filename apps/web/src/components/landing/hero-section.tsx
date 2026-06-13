'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, Info, Sword, Zap, Star } from 'lucide-react';
import { AnimatedTag } from './animated-tag';

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden bg-[#030303]">

      {/* ── Animated gradient orbs ─────────────────────────── */}
      <motion.div
        className="absolute top-[-10%] left-[20%] w-[600px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(62,207,142,0.07) 0%, transparent 70%)' }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[5%] right-[10%] w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(62,207,142,0.05) 0%, transparent 70%)' }}
        animate={{ x: [0, -30, 30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute top-[40%] left-[-5%] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(20,175,235,0.04) 0%, transparent 70%)' }}
        animate={{ x: [0, 25, -10, 0], y: [0, -15, 25, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />

      {/* ── Dot grid ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          opacity: 0.07,
        }}
      />

      <div className="relative max-w-[1400px] w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── Left: Text ─────────────────────────────────────── */}
        <div className="flex flex-col items-start text-left z-10">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <AnimatedTag />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] mb-6 text-white"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            OTC trading room{' '}
            <br className="hidden md:block" />
            for{' '}
            <motion.span
              className="text-[#3ECF8E] inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease }}
            >
              digital assets.
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-white/50 leading-relaxed font-light mb-10 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.25, ease }}
          >
            Trade Window helps two parties build, inspect and lock custom asset deals before signing — from tokens and NFTs to future tokenized assets and interchain bundles.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.38, ease }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="relative overflow-hidden rounded-lg w-full sm:w-auto">
              <Link
                href="/request"
                className="relative z-10 w-full sm:w-auto px-7 py-3.5 bg-[#3ECF8E] hover:bg-[#4ADBA0] text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 group text-sm"
              >
                Request a Deal
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <ArrowRight size={15} />
                </motion.span>
              </Link>
              {/* shimmer */}
              <motion.div
                className="absolute inset-0 -skew-x-12 bg-white/20 pointer-events-none z-20"
                initial={{ x: '-120%' }}
                animate={{ x: ['−120%', '220%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
              <Link
                href="/trade"
                className="w-full sm:w-auto px-7 py-3.5 bg-transparent border border-[#2b2b2b] hover:border-[#3b3b3b] hover:bg-white/[0.03] text-white font-medium rounded-lg transition-all text-center text-sm flex items-center justify-center"
              >
                Launch Demo Room
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-6 flex items-center gap-2 text-[11px] text-white/30 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <Info size={12} className="text-white/20" />
            MVP prototype — mainnet settlement disabled
          </motion.div>
        </div>

        {/* ── Right: Floating Mockup ──────────────────────────── */}
        <motion.div
          className="relative w-full lg:h-[540px] z-10"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
        >
          {/* Floating animation */}
          <motion.div
            className="relative w-full h-full"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Glow behind mockup */}
            <div className="absolute inset-0 bg-[#3ECF8E]/5 blur-3xl rounded-2xl scale-95 pointer-events-none" />

            <div className="relative w-full h-full bg-[#0c0c0c] rounded-xl border border-[#1c1c1c] shadow-2xl flex flex-col font-sans overflow-hidden">

              {/* Mockup Header */}
              <div className="h-10 border-b border-[#1c1c1c] bg-[#0a0a0a] flex items-center px-4 justify-between">
                <div className="flex gap-1.5">
                  {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                    <motion.div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: c, opacity: 0.5 }}
                      whileHover={{ opacity: 1, scale: 1.2 }}
                    />
                  ))}
                </div>
                <div className="text-[10px] text-white/30 font-mono bg-[#111] px-2 py-0.5 rounded border border-[#1c1c1c]">trade-window/demo</div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#3ECF8E]">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  Connected
                </div>
              </div>

              {/* Mockup Body */}
              <div className="flex-1 p-3 grid grid-cols-2 gap-3 relative overflow-hidden">

                {/* User A Panel — ATONE + 2 weapon NFTs */}
                <motion.div
                  className="bg-[#111111] border border-[#1c1c1c] rounded-lg p-3 flex flex-col gap-2 relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <div className="absolute inset-0 border border-[#3ECF8E]/20 rounded-lg pointer-events-none" />
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-white/60 font-medium">User A</span>
                    <motion.div
                      className="flex items-center gap-1 text-[9px] text-[#3ECF8E] bg-[#3ECF8E]/10 px-1.5 py-0.5 rounded border border-[#3ECF8E]/20"
                      animate={{ borderColor: ['rgba(62,207,142,0.2)', 'rgba(62,207,142,0.5)', 'rgba(62,207,142,0.2)'] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Lock size={7} /> Locked
                    </motion.div>
                  </div>

                  {/* Token row */}
                  <div className="bg-[#0a0a0a] rounded-md px-2.5 py-2 flex items-center gap-2 border border-[#1c1c1c]">
                    <div className="w-7 h-7 rounded-md bg-[#1a1a1a] flex items-center justify-center p-1 border border-[#2b2b2b] shrink-0">
                      <Image src="/assets/logos/atomone.svg" alt="AtomOne" width={18} height={18} className="object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white leading-none">1,500.00</div>
                      <div className="text-[9px] text-white/35 font-mono mt-0.5">uatone</div>
                    </div>
                    <ShieldCheck size={10} className="text-[#3ECF8E]/50 shrink-0" />
                  </div>

                  {/* NFT — Dragon Sword */}
                  <div className="bg-[#0a0a0a] rounded-md px-2.5 py-2 flex items-center gap-2 border border-[#1c1c1c]">
                    <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center text-[13px]"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                      ⚔
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold text-white leading-none truncate">Dragon Sword <span className="text-white/40">#4821</span></div>
                      <div className="text-[9px] text-white/30 mt-0.5">Pixel Realm</div>
                    </div>
                    <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">RARE</span>
                  </div>

                  {/* NFT — Shadow Knight */}
                  <div className="bg-[#0a0a0a] rounded-md px-2.5 py-2 flex items-center gap-2 border border-[#1c1c1c]">
                    <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center text-[13px]"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}>
                      🛡
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold text-white leading-none truncate">Shadow Knight <span className="text-white/40">#099</span></div>
                      <div className="text-[9px] text-white/30 mt-0.5">Dark Guild</div>
                    </div>
                    <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 shrink-0">EPIC</span>
                  </div>
                </motion.div>

                {/* User B Panel — GNOT + character NFT */}
                <motion.div
                  className="bg-[#111111] border border-[#1c1c1c] rounded-lg p-3 flex flex-col gap-2 relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.4 }}
                >
                  <div className="absolute inset-0 border border-[#3ECF8E]/20 rounded-lg pointer-events-none" />
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-white/60 font-medium">User B</span>
                    <div className="flex items-center gap-1 text-[9px] text-[#3ECF8E] bg-[#3ECF8E]/10 px-1.5 py-0.5 rounded border border-[#3ECF8E]/20">
                      <Lock size={7} /> Locked
                    </div>
                  </div>

                  {/* Token row — GNOT */}
                  <div className="bg-[#0a0a0a] rounded-md px-2.5 py-2 flex items-center gap-2 border border-[#1c1c1c]">
                    <div className="w-7 h-7 rounded-md bg-[#1a1a1a] flex items-center justify-center p-1 border border-[#2b2b2b] shrink-0">
                      <Image src="/assets/logos/gnot-icon.svg" alt="GNOT" width={18} height={18} className="object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white leading-none">500.00</div>
                      <div className="text-[9px] text-white/35 font-mono mt-0.5">ugnot</div>
                    </div>
                    <ShieldCheck size={10} className="text-[#3ECF8E]/50 shrink-0" />
                  </div>

                  {/* NFT — Void Mage character */}
                  <div className="bg-[#0a0a0a] rounded-md px-2.5 py-2 flex items-center gap-2 border border-[#1c1c1c]">
                    <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center text-[13px]"
                      style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
                      🔮
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold text-white leading-none truncate">Void Mage <span className="text-white/40">#213</span></div>
                      <div className="text-[9px] text-white/30 mt-0.5">Mystic Order</div>
                    </div>
                    <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 shrink-0">LEGENDARY</span>
                  </div>

                  {/* NFT — Inferno Drake */}
                  <div className="bg-[#0a0a0a] rounded-md px-2.5 py-2 flex items-center gap-2 border border-[#1c1c1c]">
                    <div className="w-7 h-7 rounded-md shrink-0 flex items-center justify-center text-[13px]"
                      style={{ background: 'linear-gradient(135deg, #ef4444, #b45309)' }}>
                      🐉
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold text-white leading-none truncate">Inferno Drake <span className="text-white/40">#07</span></div>
                      <div className="text-[9px] text-white/30 mt-0.5">Dragon Kin</div>
                    </div>
                    <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 shrink-0">EPIC</span>
                  </div>
                </motion.div>

                {/* Intent Hash preview */}
                <motion.div
                  className="absolute bottom-3 left-3 right-3 bg-[#0a0a0a] border border-[#3ECF8E]/25 rounded-lg p-3 shadow-2xl flex flex-col gap-2"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.45 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium text-white/50">Final Intent Hash</span>
                    <span className="text-[9px] text-[#3ECF8E] font-mono flex items-center gap-1">
                      <motion.div
                        className="w-1 h-1 rounded-full bg-[#3ECF8E]"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <CountdownDisplay />
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-[#3ECF8E] bg-[#3ECF8E]/8 px-2.5 py-2 rounded-md border border-[#3ECF8E]/20 text-center">
                    0x8f2a7b931dc240...9c4e21
                  </div>
                  <div className="w-full bg-white/[0.04] text-white/30 text-[10px] py-2 rounded-md text-center border border-[#1c1c1c] font-medium">
                    Sign &amp; Settle (Disabled in Demo)
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Ecosystem logos ─────────────────────────────────── */}
      <motion.div
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 mt-20 pt-10 border-t border-[#1c1c1c]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease }}
      >
        <div className="flex flex-col items-center justify-center gap-6">
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em]">Building for the Ecosystem</p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {[
              { src: '/assets/logos/atomone.svg', alt: 'AtomOne', label: 'AtomOne', w: 22 },
              { src: '/assets/logos/gnot-icon.svg', alt: 'Gno.land', label: 'Gno.land', w: 22 },
              { src: '/assets/logos/cosmos.svg', alt: 'Cosmos', label: 'Cosmos', w: 22 },
            ].map((eco, i) => (
              <motion.div
                key={eco.alt}
                className="flex items-center gap-2.5 opacity-35 grayscale"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ delay: 0.9 + i * 0.12, duration: 0.4 }}
                whileHover={{ opacity: 0.9, filter: 'grayscale(0)', transition: { duration: 0.25 } }}
              >
                <Image src={eco.src} alt={eco.alt} width={eco.w} height={22} className="object-contain" />
                {eco.label && <span className="text-sm font-semibold text-white tracking-wide">{eco.label}</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/** Animated countdown in mockup */
function CountdownDisplay() {
  const [n, setN] = React.useState(10);
  React.useEffect(() => {
    const id = setInterval(() => setN(p => (p <= 1 ? 10 : p - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{n}s remaining</span>;
}
