'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Wallet, Globe, Rocket } from 'lucide-react';
import { FadeUp, Stagger, StaggerItem } from '@/components/ui/animate';

const networks = [
  { icon: '/assets/logos/atomone.svg', iconAlt: 'AtomOne', title: 'AtomOne', description: 'Initial target network for secure token OTC swaps.', tag: 'Primary', tagColor: 'text-[#3ECF8E]' },
  { icon: '/assets/logos/gnot-icon.svg', iconAlt: 'Gno.land', title: 'Gno.land', description: 'Exploratory target for deterministic smart contracts and RWA/NFT registry.', tag: 'Primary', tagColor: 'text-[#3ECF8E]' },
  { icon: null, iconFallback: <Rocket size={18} />, iconAlt: 'IBC 2.0', title: 'IBC 2.0 / Eureka', description: 'Research path for cross-chain packet routing and native asset visibility.', tag: 'Research', tagColor: 'text-white/40' },
  { icon: null, iconFallback: <Globe size={18} />, iconAlt: 'Other', title: 'Additional Networks', description: 'Future integrations evaluated based on safety standards.', tag: 'Roadmap', tagColor: 'text-white/40' },
];

const wallets = [
  { name: 'Keplr', status: 'AtomOne primary', statusColor: 'text-[#3ECF8E]' },
  { name: 'Adena', status: 'Gno.land primary', statusColor: 'text-[#3ECF8E]' },
  { name: 'Cosmostation', status: 'Secondary research', statusColor: 'text-white/30' },
  { name: 'Leap', status: 'Optional target', statusColor: 'text-white/30' },
];

export function EcosystemRoadmapSection() {
  return (
    <section className="relative w-full py-24 bg-[#030303] border-t border-[#1c1c1c]">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

        {/* Left */}
        <FadeUp className="lg:col-span-5 flex flex-col items-start">
          <p className="text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-4">Ecosystem</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-5 text-white">
            AtomOne first. Built toward the Interchain.
          </h2>
          <p className="text-base text-white/40 leading-relaxed mb-8">
            Trade Window starts with an AtomOne and Gno.land direction, built on a robust Go backend foundation. Future network integrations will be added only where wallet compatibility, asset identity, and settlement paths can be rigorously validated.
          </p>

          <div className="w-full bg-[#0c0c0c] border border-[#1c1c1c] rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1c1c1c]">
              <Wallet size={13} className="text-[#3ECF8E]" />
              <span className="text-xs font-semibold text-white/60">Wallet Research Strategy</span>
            </div>
            {wallets.map((w, i) => (
              <motion.div
                key={w.name}
                className={`flex justify-between items-center px-4 py-3 text-sm ${i < wallets.length - 1 ? 'border-b border-[#1c1c1c]' : ''}`}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)', transition: { duration: 0.15 } }}
              >
                <span className="text-white/50">{w.name}</span>
                <span className={`font-mono text-xs ${w.statusColor}`}>{w.status}</span>
              </motion.div>
            ))}
            <div className="px-4 py-2.5 border-t border-[#1c1c1c]">
              <p className="text-[10px] text-white/20 font-mono">Independent integrations. No official partnerships implied.</p>
            </div>
          </div>
        </FadeUp>

        {/* Right: Network Cards */}
        <Stagger className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4" stagger={0.09} delay={0.1}>
          {networks.map((net, i) => (
            <StaggerItem key={i}>
              <motion.div
                className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-lg p-5 flex flex-col gap-4 h-full cursor-default"
                whileHover={{ y: -4, borderColor: 'rgba(62,207,142,0.2)', transition: { duration: 0.18 } }}
              >
                <div className="flex items-center justify-between">
                  <motion.div
                    className="w-9 h-9 rounded-md bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center text-white/40 shrink-0 overflow-hidden"
                    whileHover={{ scale: 1.1, transition: { type: 'spring', stiffness: 350, damping: 14 } }}
                  >
                    {net.icon ? (
                      <Image src={net.icon} alt={net.iconAlt} width={22} height={22} className="object-contain p-1" />
                    ) : net.iconFallback}
                  </motion.div>
                  <span className={`text-[10px] font-mono font-semibold ${net.tagColor}`}>{net.tag}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{net.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{net.description}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}
