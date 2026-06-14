'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

/* ── Pixel-art SVG NFT thumbnails ── */
function SwordSvg() {
  return (
    <svg viewBox="0 0 28 28" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <rect x="13" y="2" width="2" height="16" fill="#f59e0b"/>
      <rect x="13.5" y="3" width="1" height="10" fill="#fde68a" opacity="0.55"/>
      <rect x="7" y="16" width="14" height="2.5" rx="0.5" fill="#d97706"/>
      <rect x="12" y="18.5" width="4" height="5.5" fill="#92400e"/>
      <rect x="10.5" y="23.5" width="7" height="2" rx="0.5" fill="#78350f"/>
    </svg>
  );
}
function KnightSvg() {
  return (
    <svg viewBox="0 0 28 28" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="4" width="10" height="2" rx="1" fill="#5b21b6"/>
      <rect x="8" y="6" width="12" height="13" rx="1" fill="#4c1d95"/>
      <rect x="9" y="13" width="10" height="4" fill="#2d1b69"/>
      <rect x="10" y="14" width="3" height="1.5" rx="0.5" fill="#7c3aed"/>
      <rect x="15" y="14" width="3" height="1.5" rx="0.5" fill="#7c3aed"/>
      <rect x="5" y="18" width="6" height="5" rx="1" fill="#3b0764"/>
      <rect x="17" y="18" width="6" height="5" rx="1" fill="#3b0764"/>
      <rect x="10" y="19" width="8" height="5" rx="1" fill="#2d1b69"/>
    </svg>
  );
}
function MageSvg() {
  return (
    <svg viewBox="0 0 28 28" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <polygon points="14,3 10,16 18,16" fill="#7c3aed"/>
      <rect x="7" y="15.5" width="14" height="2.5" rx="0.5" fill="#6d28d9"/>
      <polygon points="14,6 14.7,8.5 17,8.5 15.1,10 15.8,12.5 14,11 12.2,12.5 12.9,10 11,8.5 13.3,8.5" fill="#f0abfc" opacity="0.9"/>
      <rect x="9" y="18" width="10" height="8" rx="2" fill="#c4b5fd"/>
      <rect x="11" y="20" width="2" height="2" fill="#4c1d95"/>
      <rect x="15" y="20" width="2" height="2" fill="#4c1d95"/>
    </svg>
  );
}
function DrakeSvg() {
  return (
    <svg viewBox="0 0 28 28" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <polygon points="6,18 2,9 11,15" fill="#7f1d1d" opacity="0.9"/>
      <polygon points="22,18 26,9 17,15" fill="#7f1d1d" opacity="0.9"/>
      <ellipse cx="14" cy="20" rx="8" ry="6" fill="#991b1b"/>
      <rect x="10" y="10" width="8" height="10" fill="#b91c1c"/>
      <rect x="8" y="6" width="12" height="8" rx="2" fill="#dc2626"/>
      <rect x="18" y="9" width="5" height="3" rx="1" fill="#b91c1c"/>
      <rect x="10" y="8" width="2.5" height="2.5" fill="#fbbf24"/>
      <ellipse cx="23" cy="9" rx="2" ry="3" fill="#f97316" opacity="0.8"/>
      <ellipse cx="23" cy="8" rx="1" ry="1.5" fill="#fde047" opacity="0.9"/>
    </svg>
  );
}
import {
  ArrowLeftRight,
  LayoutGrid,
  Mail,
  Code2,
  ArrowRight,
  Lock,
  Timer,
  Hash,
  ShieldCheck,
} from 'lucide-react';
import { FadeUp, Stagger, StaggerItem } from '@/components/ui/animate';

const products = [
  {
    id: 'trade-room',
    label: 'Trade Room',
    status: 'Live',
    statusColor: 'text-[#3ECF8E] bg-[#3ECF8E]/10 border-[#3ECF8E]/25',
    href: '/trade',
    icon: ArrowLeftRight,
    iconBg: 'bg-sky-500/10 border-sky-500/20',
    iconColor: 'text-sky-400',
    description: "Real-time P2P trade room. Both parties add assets, inspect each other's bundles, lock and review the final intent before signing.",
    features: ['Append-only offers', '10-sec countdown', 'Intent hash preview'],
    featureIcons: [Lock, Timer, Hash],
    cta: 'Open Trade Room',
    featured: true,
  },
  {
    id: 'otc-board',
    label: 'OTC Board',
    status: 'Live',
    statusColor: 'text-[#3ECF8E] bg-[#3ECF8E]/10 border-[#3ECF8E]/25',
    href: '/board',
    icon: LayoutGrid,
    iconBg: 'bg-violet-500/10 border-violet-500/20',
    iconColor: 'text-violet-400',
    description: 'Public board for posting deal intents. Browse what others want to trade and reach out directly.',
    features: ['Public deal intents', 'Filter by asset / chain', 'Post your own deal'],
    featureIcons: [ShieldCheck, LayoutGrid, ArrowRight],
    cta: 'Browse Board',
    featured: false,
  },
  {
    id: 'private-request',
    label: 'Private Request',
    status: 'Live',
    statusColor: 'text-[#3ECF8E] bg-[#3ECF8E]/10 border-[#3ECF8E]/25',
    href: '/request',
    icon: Mail,
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-400',
    description: 'Submit a private OTC request without publishing to the public board. Direct coordination.',
    features: ['Private contact only', 'Custom asset bundles', 'No public exposure'],
    featureIcons: [Lock, Hash, ShieldCheck],
    cta: 'Submit Request',
    featured: false,
  },
  {
    id: 'gno-realm',
    label: 'Gno.land Realm',
    status: 'In progress',
    statusColor: 'text-amber-400/80 bg-amber-500/8 border-amber-500/20',
    href: '/whitepaper',
    icon: Code2,
    iconBg: 'bg-[#3ECF8E]/10 border-[#3ECF8E]/20',
    iconColor: 'text-[#3ECF8E]',
    description: 'On-chain intent commitment layer on Gno.land. Deterministic trade intents, verified asset registry, and fee logic.',
    features: ['Intent commitments', 'Asset registry', 'Fee logic scaffold'],
    featureIcons: [Hash, ShieldCheck, Code2],
    cta: 'Read Whitepaper',
    featured: false,
    comingSoon: true,
  },
];

export function ProductsSection() {
  return (
    <section className="relative w-full py-24 bg-[#030303] border-t border-[#1c1c1c] overflow-hidden">

      {/* Background ambient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6">

        <FadeUp className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-4">Products</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-5 text-white">
            Everything you need for safe P2P trading.
          </h2>
          <p className="text-base text-white/40 leading-relaxed">
            Four interconnected products — from real-time trade rooms to on-chain intent commitments.
          </p>
        </FadeUp>

        {/* Featured Trade Room + 3 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Featured: Trade Room — spans 3 cols */}
          <FadeUp delay={0.05} className="lg:col-span-3">
            <motion.div
              className="relative h-full bg-[#0c0c0c] border border-[#1c1c1c] rounded-xl p-7 flex flex-col gap-6 overflow-hidden cursor-default group"
              whileHover={{
                borderColor: 'rgba(14,165,233,0.35)',
                boxShadow: '0 0 40px rgba(14,165,233,0.06)',
                transition: { duration: 0.25 },
              }}
            >
              {/* Ambient glow */}
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at top right, rgba(14,165,233,0.06) 0%, transparent 70%)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div className="flex items-start justify-between gap-4">
                <motion.div
                  className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0"
                  whileHover={{ scale: 1.1, rotate: 6, transition: { type: 'spring', stiffness: 350, damping: 14 } }}
                >
                  <ArrowLeftRight size={20} className="text-sky-400" />
                </motion.div>
                <span className="text-[10px] font-mono px-2 py-1 rounded border text-[#3ECF8E] bg-[#3ECF8E]/10 border-[#3ECF8E]/25">
                  Live
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">OTC Trade Room</h3>
                <p className="text-sm text-white/50 leading-relaxed mb-5">
                  Real-time P2P trade room. Both parties add assets, inspect each other&apos;s bundles, lock and review the final intent before signing. All actions are logged. No silent changes.
                </p>

                {/* Mini trade window demo */}
                <div className="bg-[#080808] border border-[#1c1c1c] rounded-lg p-3 mb-5 grid grid-cols-2 gap-2">
                  {/* User A */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-mono text-white/30 uppercase">User A</span>
                      <span className="text-[8px] text-[#3ECF8E] font-mono">Locked ✓</span>
                    </div>
                    <div className="flex items-center gap-0 rounded overflow-hidden border" style={{ borderColor: 'rgba(245,158,11,0.22)', background: '#0d0a04' }}>
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#422006,#1a0a00)' }}><SwordSvg /></div>
                      <div className="flex-1 min-w-0 px-1.5 py-1">
                        <div className="text-[9px] font-semibold text-white leading-none">Dragon Sword <span className="text-white/30">#4821</span></div>
                        <div className="text-[7px] font-mono mt-0.5" style={{ color: '#f59e0b' }}>RARE</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0 rounded overflow-hidden border" style={{ borderColor: 'rgba(124,58,237,0.22)', background: '#060410' }}>
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1e1040,#0a0520)' }}><KnightSvg /></div>
                      <div className="flex-1 min-w-0 px-1.5 py-1">
                        <div className="text-[9px] font-semibold text-white leading-none">Shadow Knight <span className="text-white/30">#099</span></div>
                        <div className="text-[7px] font-mono mt-0.5" style={{ color: '#a78bfa' }}>EPIC</div>
                      </div>
                    </div>
                  </div>
                  {/* User B */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] font-mono text-white/30 uppercase">User B</span>
                      <span className="text-[8px] text-[#3ECF8E] font-mono">Locked ✓</span>
                    </div>
                    <div className="flex items-center gap-0 rounded overflow-hidden border" style={{ borderColor: 'rgba(236,72,153,0.22)', background: '#0b0510' }}>
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#2d1040,#1a0828)' }}><MageSvg /></div>
                      <div className="flex-1 min-w-0 px-1.5 py-1">
                        <div className="text-[9px] font-semibold text-white leading-none">Void Mage <span className="text-white/30">#213</span></div>
                        <div className="text-[7px] font-mono mt-0.5" style={{ color: '#f472b6' }}>LEGENDARY</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0 rounded overflow-hidden border" style={{ borderColor: 'rgba(239,68,68,0.22)', background: '#0f0404' }}>
                      <div className="w-8 h-8 shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#3f0808,#1a0404)' }}><DrakeSvg /></div>
                      <div className="flex-1 min-w-0 px-1.5 py-1">
                        <div className="text-[9px] font-semibold text-white leading-none">Inferno Drake <span className="text-white/30">#07</span></div>
                        <div className="text-[7px] font-mono mt-0.5" style={{ color: '#f87171' }}>EPIC</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini step flow */}
                <div className="flex items-center gap-2 flex-wrap">
                  {['Add Assets', 'Inspect', 'Lock', 'Countdown', 'Sign'].map((step, i) => (
                    <React.Fragment key={step}>
                      <div className="flex items-center gap-1.5 bg-[#111] border border-[#1c1c1c] rounded-md px-2.5 py-1.5">
                        <span className="text-[10px] font-mono text-[#3ECF8E]/60 w-3.5">{i + 1}</span>
                        <span className="text-[11px] text-white/50">{step}</span>
                      </div>
                      {i < 4 && <span className="text-white/15 text-xs">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <motion.div whileHover={{ x: 3 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                <Link
                  href="/trade"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
                >
                  Open Trade Room <ArrowRight size={14} />
                </Link>
              </motion.div>
            </motion.div>
          </FadeUp>

          {/* Right column: OTC Board + Private Request stacked */}
          <Stagger className="lg:col-span-2 flex flex-col gap-4" stagger={0.08} delay={0.1}>
            {products.slice(1, 3).map((product) => {
              const Icon = product.icon;
              return (
                <StaggerItem key={product.id} className="flex-1">
                  <motion.div
                    className="relative h-full bg-[#0c0c0c] border border-[#1c1c1c] rounded-xl p-5 flex flex-col gap-4 overflow-hidden cursor-default"
                    whileHover={{
                      borderColor: 'rgba(62,207,142,0.2)',
                      boxShadow: '0 0 24px rgba(62,207,142,0.04)',
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <motion.div
                        className={`w-9 h-9 rounded-lg ${product.iconBg} border flex items-center justify-center shrink-0`}
                        whileHover={{ scale: 1.1, rotate: -5, transition: { type: 'spring', stiffness: 350, damping: 14 } }}
                      >
                        <Icon size={17} className={product.iconColor} />
                      </motion.div>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${product.statusColor}`}>
                        {product.status}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white mb-1.5">{product.label}</h3>
                      <p className="text-xs text-white/40 leading-relaxed">{product.description}</p>
                    </div>

                    <motion.div whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                      <Link
                        href={product.href}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white transition-colors"
                      >
                        {product.cta} <ArrowRight size={11} />
                      </Link>
                    </motion.div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </Stagger>

          {/* Gno.land Realm — full width, coming soon */}
          <FadeUp delay={0.2} className="lg:col-span-5">
            <motion.div
              className="relative bg-[#0c0c0c] border border-[#1c1c1c] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 overflow-hidden cursor-default"
              whileHover={{
                borderColor: 'rgba(62,207,142,0.2)',
                transition: { duration: 0.2 },
              }}
            >
              {/* Subtle green ambient */}
              <div
                className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none"
                style={{ background: 'linear-gradient(to left, rgba(62,207,142,0.03), transparent)' }}
              />

              <motion.div
                className="w-10 h-10 rounded-xl bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 flex items-center justify-center shrink-0"
                whileHover={{ scale: 1.08, rotate: 5, transition: { type: 'spring', stiffness: 350, damping: 14 } }}
              >
                <Code2 size={18} className="text-[#3ECF8E]" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white">Gno.land Realm</h3>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border text-amber-400/80 bg-amber-500/8 border-amber-500/20">
                    In progress
                  </span>
                </div>
                <p className="text-xs text-white/40 leading-relaxed max-w-2xl">
                  On-chain intent commitment layer written in Gno. Deterministic trade intents, verified asset registry, fee logic, and future utility token scaffolding. Non-custodial by design.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {['Intent commitments', 'Asset registry', 'Fee logic'].map((f) => (
                  <div key={f} className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-white/30">
                    <div className="w-1 h-1 rounded-full bg-[#3ECF8E]/40" />
                    {f}
                  </div>
                ))}
                <motion.div whileHover={{ x: 2 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <Link
                    href="/whitepaper"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/40 hover:text-white/80 transition-colors whitespace-nowrap"
                  >
                    Read whitepaper <ArrowRight size={11} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </FadeUp>

        </div>
      </div>
    </section>
  );
}
