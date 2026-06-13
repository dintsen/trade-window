import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/header';

import { HeroSection } from '../components/landing/hero-section';
import { ProblemSection } from '../components/landing/problem-section';
import { ProductsSection } from '../components/landing/products-section';
import { AssetClassesSection } from '../components/landing/asset-classes-section';
import { SafetyMechanicsSection } from '../components/landing/safety-mechanics-section';
import { ProductPreviewSection } from '../components/landing/product-preview-section';
import { EcosystemRoadmapSection } from '../components/landing/ecosystem-roadmap-section';
import { OtcBoardSection } from '../components/landing/otc-board-section';
import { FinalCtaSection } from '../components/landing/final-cta-section';
import { DonationBanner } from '../components/support/donation-banner';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-emerald-500/30">
      
      <Header />

      <main className="relative flex-1 flex flex-col w-full">
        <HeroSection />
        <ProblemSection />
        <ProductsSection />
        <AssetClassesSection />
        <OtcBoardSection />
        <SafetyMechanicsSection />
        <ProductPreviewSection />
        <EcosystemRoadmapSection />
        <FinalCtaSection />
        <DonationBanner />
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#030303] py-12 border-t border-[#1c1c1c] text-center">
        <Image src="/logo-trade.svg" alt="TradeWindow" width={100} height={20} className="object-contain opacity-50 mx-auto mb-6" />
        <div className="max-w-2xl mx-auto px-6 mt-8">
          <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium mb-4">
            Trade Window is an open-source project. Not financial advice.
          </p>
          <div className="text-[11px] text-white/40 leading-relaxed font-mono space-y-1">
            <p>• Non-custodial OTC coordination and transaction preview. No private keys are ever stored.</p>
            <p>• Mainnet settlement remains disabled while the Gno.land commitment layer is finalized.</p>
            <p>• Current demo uses backend-authoritative mock rooms.</p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6 text-[11px] text-white/40 font-mono">
            <a href="https://github.com/dintsen/trade-window" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">GitHub</a>
            <span className="text-white/10">|</span>
            <Link href="/whitepaper" className="hover:text-white/70 transition-colors">Whitepaper</Link>
            <span className="text-white/10">|</span>
            <Link href="/history" className="hover:text-white/70 transition-colors">My Trades</Link>
            <span className="text-white/10">|</span>
            <Link href="/#support" className="hover:text-emerald-400/80 transition-colors">Support us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
