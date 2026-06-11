import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/header';

import { HeroSection } from '../components/landing/hero-section';
import { ProblemSection } from '../components/landing/problem-section';
import { AssetClassesSection } from '../components/landing/asset-classes-section';
import { SafetyMechanicsSection } from '../components/landing/safety-mechanics-section';
import { ProductPreviewSection } from '../components/landing/product-preview-section';
import { EcosystemRoadmapSection } from '../components/landing/ecosystem-roadmap-section';
import { FinalCtaSection } from '../components/landing/final-cta-section';

import { ChevronDown } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-emerald-500/30">
      
      <Header />

      <main className="relative flex-1 flex flex-col w-full">
        <HeroSection />
        <ProblemSection />
        <AssetClassesSection />
        <SafetyMechanicsSection />
        <ProductPreviewSection />
        <EcosystemRoadmapSection />
        <FinalCtaSection />
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#030303] py-12 border-t border-white/5 text-center">
        <Image src="/logo-trade.svg" alt="TradeWindow" width={100} height={20} className="object-contain opacity-50 mx-auto mb-6" />
        <div className="max-w-2xl mx-auto px-6 mt-8">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium mb-4">
            Trade Window is an open-source project. Not financial advice.
          </p>
          <div className="text-[11px] text-white/40 leading-relaxed font-mono space-y-1">
            <p>• Planned Gno.land protocol layer / Gno commitment layer.</p>
            <p>• Current demo uses backend-authoritative mock rooms.</p>
            <p>• Future finalized commitments are planned for Gno smart contracts.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
