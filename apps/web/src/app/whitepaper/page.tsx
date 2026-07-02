import { Header } from '@/components/layout/header';

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-emerald-500/30">
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      
      <Header />

      <main className="max-w-4xl w-full mx-auto px-6 flex flex-col relative z-10 py-32">
        <article className="max-w-3xl">
          <div className="mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-8">
              Technical Paper v1.0
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-white">
              Deterministic OTC Coordination
            </h1>
            <p className="text-xl text-white/60 font-light leading-relaxed">
              An architecture for structured, non-custodial multi-asset OTC coordination on the Interchain.
            </p>
          </div>

          <div className="prose prose-invert prose-emerald max-w-none text-white/60 leading-relaxed text-lg">
            <h2 className="text-3xl font-semibold text-white mt-16 mb-6">1. Introduction</h2>
            <p>
              Over-the-Counter (OTC) trading in decentralized finance has historically been fraught with UX friction and security vulnerabilities. Traditional atomic swaps often require complex smart contract interactions or suffer from non-deterministic states where one party can grief the other.
            </p>
            <p>
              TradeWindow introduces a strict, append-only negotiation protocol combined with a double-lock deterministic intent model, built explicitly for the AtomOne and Gno.land ecosystems.
            </p>

            <h2 className="text-3xl font-semibold text-white mt-16 mb-6">2. The Double-Lock Mechanism</h2>
            <p>
              To eliminate substitution scams (where a counterparty swaps an asset at the last millisecond), TradeWindow enforces an append-only state. Assets cannot be removed from an offer once added.
            </p>
            <p>
              When a party is satisfied with their bundle, they &quot;Lock&quot; their side. Future Gno.land commitment logic can require both parties to have an active lock. If either party modifies their bundle, existing locks are invalidated and must be explicitly re-approved.
            </p>

            <h2 className="text-3xl font-semibold text-white mt-16 mb-6">3. Technical Traceability</h2>
            <p>
              Display names (e.g., &quot;USDC&quot;) are easily spoofed. The UI enforces technical traceability, requiring users to inspect the underlying `baseDenom`, `sourceChain`, and `ibcTrace`.
            </p>
            
            <div className="bg-[#0a0a0a]/50 backdrop-blur-xl border border-white/5 p-8 rounded-3xl my-8 font-mono text-sm text-emerald-400">
              {`{
  "displayDenom": "USDC",
  "technicalDenom": "ibc/ED07...4B1",
  "sourceChain": "Osmosis",
  "verificationStatus": "suspicious"
}`}
            </div>

            <p>
              By surfacing this data deterministically from the chain registry, we remove the reliance on front-end curation.
            </p>

            <h2 className="text-3xl font-semibold text-white mt-16 mb-6">4. Future: NFTs and RWAs</h2>
            <p>
              While the MVP focuses on fungible tokens (ATONE, PHOTON), the backend architecture treats all assets as generic interfaces. This paves the way for direct P2P exchange of Non-Fungible Tokens (NFTs) and Real-World Assets (RWAs) registered on Gno.land.
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
