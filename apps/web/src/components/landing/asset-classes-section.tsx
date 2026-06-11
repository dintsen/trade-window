import React from 'react';
import { Coins, Image as ImageIcon, Briefcase, Gamepad2, Network, Globe } from 'lucide-react';

const assets = [
  {
    icon: <Coins size={24} />,
    title: "Tokens",
    description: "Mocked demo assets today, with AtomOne and Cosmos integration planned for the future."
  },
  {
    icon: <ImageIcon size={24} />,
    title: "NFTs",
    description: "Planned architecture to support collectible assets for safe P2P exchange."
  },
  {
    icon: <Briefcase size={24} />,
    title: "Tokenized Stocks & RWAs",
    description: "A roadmap category designed for complex, negotiated OTC bundles."
  },
  {
    icon: <Gamepad2 size={24} />,
    title: "Game Assets",
    description: "Future support planned for trading in-game items securely without blind signing."
  },
  {
    icon: <Network size={24} />,
    title: "IBC Assets",
    description: "Future interchain asset visibility and routing research across connected zones."
  },
  {
    icon: <Globe size={24} />,
    title: "Future Networks",
    description: "Additional ecosystem support planned after wallet and settlement paths are fully validated."
  }
];

export function AssetClassesSection() {
  return (
    <section className="relative w-full py-24 bg-[#030303]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-[1200px] mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter mb-6 text-white">
            Built for custom asset bundles.
          </h2>
          <p className="text-lg text-white/40 font-light">
            Trade Window&apos;s architecture is designed to eventually support any deterministic asset on the interchain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((item, i) => (
            <div 
              key={i}
              className="bg-black/50 backdrop-blur-sm border border-white/5 hover:border-white/10 rounded-2xl p-8 flex flex-col gap-4 transition-all group relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                {item.icon}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
