import React from 'react';
import { Network, Database, Wallet, Rocket } from 'lucide-react';

const networks = [
  {
    icon: <Database size={24} />,
    title: "AtomOne",
    description: "Initial target network for secure token OTC swaps."
  },
  {
    icon: <Network size={24} />,
    title: "Gno.land",
    description: "Exploratory target for deterministic smart contracts and RWA/NFT registry."
  },
  {
    icon: <Rocket size={24} />,
    title: "IBC 2.0 / Eureka",
    description: "Research path for cross-chain packet routing and native asset visibility."
  },
  {
    icon: <Globe size={24} />,
    title: "Additional Networks",
    description: "Future integrations evaluated based on safety standards."
  }
];

import { Globe } from 'lucide-react';

export function EcosystemRoadmapSection() {
  return (
    <section className="relative w-full py-24 bg-[#030303] border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left: Content */}
        <div className="lg:col-span-5 flex flex-col items-start">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter mb-6 text-white">
            AtomOne first. Built toward the Interchain.
          </h2>
          <p className="text-lg text-white/40 font-light leading-relaxed mb-8">
            Trade Window starts with an AtomOne and Gno.land direction, built on a robust Go backend foundation. Future network integrations will be added only where wallet compatibility, asset identity, and settlement paths can be rigorously validated.
          </p>

          <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Wallet size={18} className="text-emerald-400" />
              <h3 className="font-medium text-white/80">Wallet Research Strategy</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-white/60">Keplr</span>
                <span className="text-emerald-400 font-mono text-xs">AtomOne primary</span>
              </li>
              <li className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-white/60">Adena</span>
                <span className="text-emerald-400 font-mono text-xs">Gno.land primary</span>
              </li>
              <li className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-white/60">Cosmostation</span>
                <span className="text-white/40 font-mono text-xs">Secondary research</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-white/60">Leap</span>
                <span className="text-white/40 font-mono text-xs">Optional target</span>
              </li>
            </ul>
            <p className="text-[10px] text-white/30 mt-4 uppercase tracking-widest text-center">
              Independent integrations. No official partnerships implied.
            </p>
          </div>
        </div>

        {/* Right: Network Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {networks.map((net, i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                {net.icon}
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">{net.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{net.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
