'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, Info } from 'lucide-react';
import { AnimatedTag } from './animated-tag';

/* ── Pixel-art SVG NFT thumbnails ── */
function SwordSvg({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <rect x="13" y="2" width="2" height="16" fill="#f59e0b"/>
      <rect x="13.5" y="3" width="1" height="10" fill="#fde68a" opacity="0.55"/>
      <rect x="7" y="16" width="14" height="2.5" rx="0.5" fill="#d97706"/>
      <rect x="12" y="18.5" width="4" height="5.5" fill="#92400e"/>
      <rect x="10.5" y="23.5" width="7" height="2" rx="0.5" fill="#78350f"/>
    </svg>
  );
}

function KnightSvg({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="4" width="10" height="2" rx="1" fill="#5b21b6"/>
      <rect x="8" y="6" width="12" height="13" rx="1" fill="#4c1d95"/>
      <rect x="9" y="13" width="10" height="4" fill="#2d1b69"/>
      <rect x="10" y="14" width="3" height="1.5" rx="0.5" fill="#7c3aed"/>
      <rect x="15" y="14" width="3" height="1.5" rx="0.5" fill="#7c3aed"/>
      <rect x="5" y="18" width="6" height="5" rx="1" fill="#3b0764"/>
      <rect x="17" y="18" width="6" height="5" rx="1" fill="#3b0764"/>
      <rect x="10" y="19" width="8" height="5" rx="1" fill="#2d1b69"/>
      <rect x="12" y="20" width="4" height="3" fill="#1e1040"/>
    </svg>
  );
}

function MageSvg({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <polygon points="14,3 10,16 18,16" fill="#7c3aed"/>
      <rect x="7" y="15.5" width="14" height="2.5" rx="0.5" fill="#6d28d9"/>
      <polygon points="14,6 14.7,8.5 17,8.5 15.1,10 15.8,12.5 14,11 12.2,12.5 12.9,10 11,8.5 13.3,8.5" fill="#f0abfc" opacity="0.9"/>
      <rect x="9" y="18" width="10" height="8" rx="2" fill="#c4b5fd"/>
      <rect x="11" y="20" width="2" height="2" fill="#4c1d95"/>
      <rect x="15" y="20" width="2" height="2" fill="#4c1d95"/>
      <rect x="12" y="23" width="4" height="1" rx="0.5" fill="#7c3aed" opacity="0.6"/>
    </svg>
  );
}

function DrakeSvg({ size = 32 }: { size?: number }) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <polygon points="6,18 2,9 11,15" fill="#7f1d1d" opacity="0.9"/>
      <polygon points="22,18 26,9 17,15" fill="#7f1d1d" opacity="0.9"/>
      <ellipse cx="14" cy="20" rx="8" ry="6" fill="#991b1b"/>
      <rect x="10" y="10" width="8" height="10" fill="#b91c1c"/>
      <rect x="8" y="6" width="12" height="8" rx="2" fill="#dc2626"/>
      <rect x="18" y="9" width="5" height="3" rx="1" fill="#b91c1c"/>
      <rect x="10" y="8" width="2.5" height="2.5" fill="#fbbf24"/>
      <rect x="15.5" y="8" width="2" height="2" fill="#fbbf24"/>
      <ellipse cx="23" cy="9" rx="2" ry="3" fill="#f97316" opacity="0.8"/>
      <ellipse cx="23" cy="8" rx="1" ry="1.5" fill="#fde047" opacity="0.9"/>
    </svg>
  );
}

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 overflow-hidden bg-[#030303]">

      {/* ── Animated gradient orbs ─────────────────────────── */}
      {/* Large pulsing green orb — top center */}
      <motion.div
        className="absolute top-[-15%] left-[15%] w-[700px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(62,207,142,0.18) 0%, rgba(62,207,142,0.06) 40%, transparent 70%)' }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Secondary orb — bottom right */}
      <motion.div
        className="absolute bottom-[0%] right-[5%] w-[550px] h-[450px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(62,207,142,0.12) 0%, rgba(62,207,142,0.04) 45%, transparent 70%)' }}
        animate={{ x: [0, -30, 30, 0], y: [0, 20, -20, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      {/* Blue accent orb — left side */}
      <motion.div
        className="absolute top-[35%] left-[-8%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(20,175,235,0.08) 0%, transparent 70%)' }}
        animate={{ x: [0, 25, -10, 0], y: [0, -15, 25, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
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
                Create Trade Room
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
              <div className="flex-1 flex flex-col gap-2 p-3 overflow-hidden">

                {/* Two panels */}
                <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">

                  {/* User A Panel */}
                  <motion.div
                    className="flex flex-col rounded-xl border border-[#262626] overflow-hidden"
                    style={{ background: 'linear-gradient(180deg,#1c1c1c 0%,#141414 100%)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    {/* Locked accent line */}
                    <motion.div className="h-[2px] w-full shrink-0"
                      style={{ background: 'linear-gradient(90deg,transparent,rgba(62,207,142,0.7) 50%,transparent)' }}
                      animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}
                    />
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]"
                          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                        <span className="text-[11px] font-semibold text-white/70">User A</span>
                      </div>
                      <motion.div
                        className="flex items-center gap-1 text-[8px] text-[#3ECF8E] font-mono px-2 py-0.5 rounded-full border"
                        style={{ background: 'rgba(62,207,142,0.06)' }}
                        animate={{ borderColor: ['rgba(62,207,142,0.18)','rgba(62,207,142,0.45)','rgba(62,207,142,0.18)'] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        <Lock size={7} /> LOCKED
                      </motion.div>
                    </div>
                    {/* Token */}
                    <div className="mx-2.5 mb-2 shrink-0 flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-[#202020]" style={{ background: '#0e0e0e' }}>
                      <div className="w-8 h-8 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center shrink-0">
                        <Image src="/assets/logos/atomone.svg" alt="AtomOne" width={20} height={20} className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white leading-none tracking-tight">1,500.00</div>
                        <div className="text-[9px] text-white/30 font-mono mt-0.5">uatone · AtomOne</div>
                      </div>
                      <ShieldCheck size={12} className="text-[#3ECF8E]/45 shrink-0" />
                    </div>
                    {/* NFT 1 — Bad Kid #42 */}
                    <div className="mx-2.5 mb-2 rounded-lg border overflow-hidden shrink-0" style={{ borderColor:'rgba(245,158,11,0.28)', background:'linear-gradient(135deg,#0f0800,#0a0500)' }}>
                      <div className="h-[1px]" style={{ background:'linear-gradient(90deg,transparent,rgba(245,158,11,0.7) 50%,transparent)' }} />
                      <div className="flex items-center">
                        <div className="w-12 h-12 shrink-0 overflow-hidden bg-[#111]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="https://ipfs-gw.stargaze-apis.com/ipfs/QmbGvE3wmxex8KiBbbvMjR8f9adR28s3XkiZSTuGmHoMHV/42.jpg" alt="Bad Kid #42" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 px-2.5 py-2">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold text-white truncate">Bad Kid #42</span>
                            <span className="text-[7px] font-mono shrink-0 px-1.5 py-0.5 rounded" style={{ background:'rgba(245,158,11,0.1)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.22)' }}>RARE</span>
                          </div>
                          <div className="text-[8px] text-white/25 font-mono">Bad Kids · stargaze-1</div>
                        </div>
                      </div>
                    </div>
                    {/* NFT 2 — Bad Kid #1000 */}
                    <div className="mx-2.5 mb-2.5 rounded-lg border overflow-hidden shrink-0" style={{ borderColor:'rgba(124,58,237,0.28)', background:'linear-gradient(135deg,#080514,#050310)' }}>
                      <div className="h-[1px]" style={{ background:'linear-gradient(90deg,transparent,rgba(124,58,237,0.7) 50%,transparent)' }} />
                      <div className="flex items-center">
                        <div className="w-12 h-12 shrink-0 overflow-hidden bg-[#111]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="https://ipfs-gw.stargaze-apis.com/ipfs/QmbGvE3wmxex8KiBbbvMjR8f9adR28s3XkiZSTuGmHoMHV/1000.jpg" alt="Bad Kid #1000" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 px-2.5 py-2">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold text-white truncate">Bad Kid #1000</span>
                            <span className="text-[7px] font-mono shrink-0 px-1.5 py-0.5 rounded" style={{ background:'rgba(124,58,237,0.1)', color:'#a78bfa', border:'1px solid rgba(124,58,237,0.22)' }}>EPIC</span>
                          </div>
                          <div className="text-[8px] text-white/25 font-mono">Bad Kids · stargaze-1</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* User B Panel */}
                  <motion.div
                    className="flex flex-col rounded-xl border border-[#262626] overflow-hidden"
                    style={{ background: 'linear-gradient(180deg,#1c1c1c 0%,#141414 100%)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75, duration: 0.4 }}
                  >
                    <motion.div className="h-[2px] w-full shrink-0"
                      style={{ background: 'linear-gradient(90deg,transparent,rgba(62,207,142,0.7) 50%,transparent)' }}
                      animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
                    />
                    <div className="flex items-center justify-between px-3 py-2 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-[#3ECF8E]"
                          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }} />
                        <span className="text-[11px] font-semibold text-white/70">User B</span>
                      </div>
                      <div className="flex items-center gap-1 text-[8px] text-[#3ECF8E] font-mono px-2 py-0.5 rounded-full border border-[#3ECF8E]/20" style={{ background:'rgba(62,207,142,0.06)' }}>
                        <Lock size={7} /> LOCKED
                      </div>
                    </div>
                    {/* Token GNOT */}
                    <div className="mx-2.5 mb-2 shrink-0 flex items-center gap-2.5 px-2.5 py-2 rounded-lg border border-[#202020]" style={{ background:'#0e0e0e' }}>
                      <div className="w-8 h-8 rounded-lg bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/assets/logos/gnot-icon.svg" alt="GNOT" className="h-5 w-auto object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white leading-none tracking-tight">500.00</div>
                        <div className="text-[9px] text-white/30 font-mono mt-0.5">ugnot · Gno.land</div>
                      </div>
                      <ShieldCheck size={12} className="text-[#3ECF8E]/45 shrink-0" />
                    </div>
                    {/* NFT 3 — Bad Kid #5000 */}
                    <div className="mx-2.5 mb-2 rounded-lg border overflow-hidden shrink-0" style={{ borderColor:'rgba(236,72,153,0.28)', background:'linear-gradient(135deg,#0b0510,#080410)' }}>
                      <div className="h-[1px]" style={{ background:'linear-gradient(90deg,transparent,rgba(236,72,153,0.7) 50%,transparent)' }} />
                      <div className="flex items-center">
                        <div className="w-12 h-12 shrink-0 overflow-hidden bg-[#111]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="https://ipfs-gw.stargaze-apis.com/ipfs/QmbGvE3wmxex8KiBbbvMjR8f9adR28s3XkiZSTuGmHoMHV/5000.jpg" alt="Bad Kid #5000" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 px-2.5 py-2">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold text-white truncate">Bad Kid #5000</span>
                            <span className="text-[7px] font-mono shrink-0 px-1.5 py-0.5 rounded" style={{ background:'rgba(236,72,153,0.1)', color:'#f472b6', border:'1px solid rgba(236,72,153,0.22)' }}>LEGENDARY</span>
                          </div>
                          <div className="text-[8px] text-white/25 font-mono">Bad Kids · stargaze-1</div>
                        </div>
                      </div>
                    </div>
                    {/* NFT 4 — Bad Kid #9000 */}
                    <div className="mx-2.5 mb-2.5 rounded-lg border overflow-hidden shrink-0" style={{ borderColor:'rgba(239,68,68,0.28)', background:'linear-gradient(135deg,#0f0404,#0a0303)' }}>
                      <div className="h-[1px]" style={{ background:'linear-gradient(90deg,transparent,rgba(239,68,68,0.7) 50%,transparent)' }} />
                      <div className="flex items-center">
                        <div className="w-12 h-12 shrink-0 overflow-hidden bg-[#111]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="https://ipfs-gw.stargaze-apis.com/ipfs/QmbGvE3wmxex8KiBbbvMjR8f9adR28s3XkiZSTuGmHoMHV/9000.jpg" alt="Bad Kid #9000" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 px-2.5 py-2">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[10px] font-bold text-white truncate">Bad Kid #9000</span>
                            <span className="text-[7px] font-mono shrink-0 px-1.5 py-0.5 rounded" style={{ background:'rgba(239,68,68,0.1)', color:'#f87171', border:'1px solid rgba(239,68,68,0.22)' }}>EPIC</span>
                          </div>
                          <div className="text-[8px] text-white/25 font-mono">Bad Kids · stargaze-1</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Intent Hash — bottom row */}
                <motion.div
                  className="shrink-0 rounded-xl border overflow-hidden"
                  style={{ borderColor:'rgba(62,207,142,0.15)', background:'linear-gradient(180deg,#0d1410 0%,#0a0f0c 100%)' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.45 }}
                >
                  <div className="h-[1px]" style={{ background:'linear-gradient(90deg,transparent,rgba(62,207,142,0.4) 50%,transparent)' }} />
                  <div className="px-3 py-2.5 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-white/35 uppercase tracking-wider">Final Intent Hash</span>
                      <span className="text-[9px] text-[#3ECF8E] font-mono flex items-center gap-1.5">
                        <motion.div className="w-1 h-1 rounded-full bg-[#3ECF8E]"
                          animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                        <CountdownDisplay />
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#3ECF8E]/80 px-3 py-1.5 rounded-lg border text-center tracking-wider" style={{ background:'rgba(62,207,142,0.05)', borderColor:'rgba(62,207,142,0.12)' }}>
                      0x8f2a7b931dc240...9c4e21
                    </div>
                    <div className="w-full py-1.5 text-[9px] text-white/20 border border-[#1c1c1c] rounded-lg text-center font-medium tracking-wide" style={{ background:'rgba(255,255,255,0.025)' }}>
                      Sign &amp; Settle · Disabled in Demo
                    </div>
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
