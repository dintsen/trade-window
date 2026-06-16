import { Heart } from "lucide-react";
import { DONATION_WALLETS } from "@/lib/support/donations";
import { DonationCard } from "./donation-card";

export function DonationBanner() {
  return (
    <section id="support" className="w-full py-20 px-6 border-t border-white/5 bg-[#050505]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-4">
            <Heart size={12} className="fill-[#3ECF8E]/20 text-[#3ECF8E]" /> Community supported
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Support Trade Window
          </h2>
          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            Help us continue building the OTC coordination layer for the Gno, Atom, and AtomOne ecosystems.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {DONATION_WALLETS.map((w) => (
            <DonationCard key={w.id} wallet={w} />
          ))}
        </div>

        <p className="text-center text-[11px] text-white/30 font-mono mt-6 leading-relaxed">
          Send only ATOM on Cosmos Hub to the ATOM address. Send only ATONE on AtomOne to the ATONE address.
        </p>
      </div>
    </section>
  );
}
