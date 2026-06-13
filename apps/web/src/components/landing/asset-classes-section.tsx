import React from 'react';
import { Coins, Image as ImageIcon, Briefcase, Gamepad2, Network, Globe } from 'lucide-react';

const assets = [
  {
    icon: <Coins size={18} />,
    title: "Tokens",
    description: "Mocked demo assets today, with AtomOne and Cosmos integration planned for the future."
  },
  {
    icon: <ImageIcon size={18} />,
    title: "NFTs",
    description: "Planned architecture to support collectible assets for safe P2P exchange."
  },
  {
    icon: <Briefcase size={18} />,
    title: "Tokenized Stocks & RWAs",
    description: "A roadmap category designed for complex, negotiated OTC bundles."
  },
  {
    icon: <Gamepad2 size={18} />,
    title: "Game Assets",
    description: "Future support planned for trading in-game items securely without blind signing."
  },
  {
    icon: <Network size={18} />,
    title: "IBC Assets",
    description: "Future interchain asset visibility and routing research across connected zones."
  },
  {
    icon: <Globe size={18} />,
    title: "Future Networks",
    description: "Additional ecosystem support planned after wallet and settlement paths are fully validated."
  }
];

export function AssetClassesSection() {
  return (
    <section className="relative w-full py-24 bg-[#030303] border-t border-[#1c1c1c]">
      <div className="max-w-[1200px] mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-4">Asset Classes</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-5 text-white">
            Built for custom asset bundles.
          </h2>
          <p className="text-base text-white/40 leading-relaxed">
            Trade Window&apos;s architecture is designed to eventually support any deterministic asset on the interchain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((item, i) => (
            <div
              key={i}
              className="bg-[#0f0f0f] border border-[#1c1c1c] hover:border-[#2b2b2b] rounded-lg p-6 flex flex-col gap-4 transition-colors"
            >
              <div className="w-9 h-9 rounded-md bg-[#1a1a1a] border border-[#2b2b2b] flex items-center justify-center text-[#3ECF8E] shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
