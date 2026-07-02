'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Cpu, ImageIcon, FileSignature, CheckCircle2, ArrowUpRight, ShieldCheck, FlaskConical } from 'lucide-react';
import { FadeUp } from '@/components/ui/animate';

interface Step {
  title: string;
  desc: string;
  status: 'done' | 'prototype' | 'pending';
  contract?: string;
  codeSnippet?: string;
}

export function ProtocolDeepDive() {
  const [activeTab, setActiveTab] = useState<'contracts' | 'nfts'>('contracts');
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps: Step[] = [
    {
      title: '1. Negotiation & Intent Generation',
      desc: 'Parties agree on the token/NFT bundle. The Go Coordination Layer generates a deterministic SHA-256 Intent Hash from sorted assets.',
      status: 'done',
      codeSnippet: `// SHA256 deterministic hash generation
func ComputeIntentHash(intent TradeIntent) string {
    b, _ := json.Marshal(intent)
    hash := sha256.Sum256(b)
    return "0x" + hex.EncodeToString(hash[:])
}`
    },
    {
      title: '2. On-Chain Room Registration',
      desc: 'The trade room initiator commits the generated intent hash to the rooms smart contract realm on Gno.land.',
      status: 'done',
      contract: 'gno/realms/tradewindow/rooms',
      codeSnippet: `// CreateRoom registers a new trade room on-chain
func CreateRoom(id, partyA, partyB, intentHash string, createdAt, expiresAt int64) string {
    caller := string(unsafe.OriginCaller())
    if caller != partyA { panic("only partyA can create") }
    // ... registers active room
    activeRooms[id] = &TradeRoom{...}
}`
    },
    {
      title: '3. Dual-Signing Commitment',
      desc: 'Both parties independently call the intents smart contract to authorize the intent hash. Consent is immutable once written.',
      status: 'done',
      contract: 'gno/realms/tradewindow/intents',
      codeSnippet: `// Dual-signing consensus validation
func CreateCommitment(id, intentHash, partyA, partyB string) string {
    caller := string(unsafe.OriginCaller())
    existing := commitments[id]
    if existing.IntentHash != intentHash { panic("intent hash mismatch") }
    if caller == partyA { existing.SignedByA = true }
    // returns true when SignedByA && SignedByB
}`
    },
    {
      title: '4. Gno Escrow Settlement Prototype',
      desc: 'The escrow realm records a bundle escrow by intent hash, requires both sides to mark funding, then releases only after dual approval or guarantor dispute resolution.',
      status: 'prototype',
      contract: 'gno/realms/tradewindow/escrow',
      codeSnippet: `// Tested escrow state machine
func Release(id string) string {
    deal := mustGet(id)
    if deal.Status == StatusFunded {
        if !deal.ReleaseApprovedA || !deal.ReleaseApprovedB {
            panic("release requires both party approvals")
        }
    }
    deal.Status = StatusReleased
    return StatusReleased
}`
    }
  ];

  return (
    <section className="relative w-full py-24 bg-[#030303] border-t border-[#121212] overflow-hidden font-sans">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <FadeUp className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-mono text-[#3ECF8E] uppercase tracking-[0.2em] mb-4">Protocol Deep-Dive</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-5 text-white">
            How Trade Window secures the trade intent.
          </h2>
          <p className="text-base text-white/45 leading-relaxed">
            Take a look under the hood at the Gno.land realm architecture, escrow prototype and read-only NFT indexing path.
          </p>
        </FadeUp>

        {/* Tab Controls */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-[#0a0a0c] border border-white/5 rounded-xl p-1.5 shadow-inner">
            <button
              onClick={() => setActiveTab('contracts')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'contracts'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'text-white/40 hover:text-white/80 border border-transparent'
              }`}
            >
              <Cpu size={16} />
              Gno.land Contracts
            </button>
            <button
              onClick={() => setActiveTab('nfts')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'nfts'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'text-white/40 hover:text-white/80 border border-transparent'
              }`}
            >
              <ImageIcon size={16} />
              NFT &amp; IPFS Retrieval
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'contracts' ? (
            <motion.div
              key="contracts"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Left Column: Interactive Flow Steps */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="text-xs font-semibold text-white/30 uppercase tracking-widest font-mono mb-2 px-1">
                  Settlement Flow
                </div>
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`group/step cursor-pointer text-left border rounded-xl p-4.5 transition-all duration-200 ${
                      activeStep === idx
                        ? 'bg-emerald-950/5 border-emerald-500/35 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                        : 'bg-[#09090b]/80 border-white/5 hover:border-white/15 hover:bg-[#0d0d10]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-semibold font-mono uppercase tracking-wide transition-colors ${
                        activeStep === idx ? 'text-emerald-400' : 'text-white/30 group-hover/step:text-white/50'
                      }`}>
                        {step.contract ? 'REALM CALL' : 'OFF-CHAIN'}
                      </span>
                      {step.status === 'done' ? (
                        <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-500 font-semibold bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded uppercase leading-none">
                          <CheckCircle2 size={8} /> Local
                        </span>
                      ) : step.status === 'prototype' ? (
                        <span className="flex items-center gap-1 text-[9px] font-mono text-sky-400 font-semibold bg-sky-500/10 border border-sky-500/25 px-1.5 py-0.5 rounded uppercase leading-none">
                          <FlaskConical size={8} /> Tested
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[9px] font-mono text-amber-500/80 font-semibold bg-amber-500/5 border border-amber-500/15 px-1.5 py-0.5 rounded uppercase leading-none">
                          Planned
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white leading-tight mb-1 group-hover/step:text-white transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-xs text-white/40 group-hover/step:text-white/50 transition-colors leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right Column: Code viewer & details */}
              <div className="lg:col-span-7 flex flex-col bg-[#08080a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Window header */}
                <div className="h-11 border-b border-white/5 bg-[#0b0b0f] flex items-center justify-between px-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/40"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/40"></span>
                    <span className="text-white/30 ml-2">/realms/tradewindow/</span>
                    <span className="text-emerald-400 font-bold">
                      {steps[activeStep].contract ? steps[activeStep].contract?.split('/').pop() + '.gno' : 'intent.go'}
                    </span>
                  </div>
                  <div className="text-[10px] text-white/20 uppercase tracking-widest font-semibold">Gno.land VM</div>
                </div>

                {/* Snippet viewer */}
                <div className="flex-1 p-5 font-mono text-[11px] leading-relaxed text-white/75 bg-black/40 overflow-x-auto select-none min-h-[300px]">
                  <pre className="text-left">
                    <code>{steps[activeStep].codeSnippet}</code>
                  </pre>
                </div>

                {/* Footer notes */}
                <div className="p-4 border-t border-white/5 bg-[#0b0b0f] flex items-center gap-3 text-xs text-white/40 leading-normal">
                  <Database size={16} className="text-[#3ECF8E] shrink-0" />
                  <div>
                    {steps[activeStep].contract ? (
                      <span>
                        Local realm logic is tested. Browser signing remains preview-only until a local/testnet Gno deployment is configured.
                      </span>
                    ) : (
                      <span>
                        Secured locally. The hash represents a cryptographic footprint of all assets; any tampering invalidates the hash.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="nfts"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
              {/* NFT Explanatory Cards */}
              <div className="flex flex-col gap-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                      <FileSignature size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">Real-Time GraphQL Querying</h3>
                      <p className="text-sm text-white/45 leading-relaxed">
                        To view your wallet assets, our Next.js UI queries chain indexers (like Stargaze mainnet GraphQL API) dynamically. We fetch collection name, token ID, and media parameters.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 flex items-center justify-center text-[#3ECF8E] shrink-0">
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">IPFS Media Pointers</h3>
                      <p className="text-sm text-white/45 leading-relaxed">
                        NFT images are stored on IPFS. If the API returns an <code className="text-emerald-400 font-mono text-xs">ipfs://</code> scheme, our asset parser rewrites the URI to load content via standard HTTPS gateways (e.g. <code className="text-white/60 font-mono text-xs">ipfs.io/ipfs/...</code>), allowing browser display.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">On-Chain Asset Registry Audit</h3>
                      <p className="text-sm text-white/45 leading-relaxed">
                        Assets are designed to be checked against the Gno.land <code className="text-pink-400 font-mono text-xs">registry.gno</code> realm. Unknown or easily-faked tokens are visibly flagged so receivers do not rely on display names.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-2 flex flex-col gap-2">
                  <div className="text-xs font-mono text-white/30 uppercase tracking-widest">Query Endpoint</div>
                  <div className="bg-[#0a0a0c] border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between font-mono text-xs text-white/65">
                    <span>https://graphql.mainnet.stargaze-apis.com/graphql</span>
                    <a href="https://graphql.mainnet.stargaze-apis.com/graphql" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Graphic Mockup of NFT API response */}
              <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6 shadow-2xl relative text-left">
                {/* Tooltip mockup inside the card */}
                <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-white/5">
                  <div className="w-12 h-12 rounded-xl border-2 border-violet-500/40 overflow-hidden bg-[#111] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://ipfs.io/ipfs/QmbGvE3wmxex8KiBbbvMjR8f9adR28s3XkiZSTuGmHoMHV/42.jpg" alt="Bad Kid #42" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">Bad Kid #42</h4>
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">stargaze-1 · stargaze1c4...x8r</span>
                  </div>
                </div>

                {/* API JSON response simulation */}
                <div className="space-y-3 font-mono text-[11px] leading-relaxed">
                  <div className="text-white/20"># Resolving IPFS metadata...</div>
                  <div className="bg-black/35 rounded-xl p-4.5 text-white/50 border border-white/5 overflow-x-auto space-y-1">
                    <div>{`{`}</div>
                    <div className="pl-4"><span className="text-purple-400">&quot;name&quot;</span>: <span className="text-emerald-400">&quot;Bad Kid #42&quot;</span>,</div>
                    <div className="pl-4"><span className="text-purple-400">&quot;collection&quot;</span>: <span className="text-emerald-400">&quot;stargaze1c4...x8r&quot;</span>,</div>
                    <div className="pl-4"><span className="text-purple-400">&quot;tokenId&quot;</span>: <span className="text-emerald-400">&quot;42&quot;</span>,</div>
                    <div className="pl-4"><span className="text-purple-400">&quot;ipfsUrl&quot;</span>: <span className="text-pink-400">&quot;ipfs://QmbGvE3.../42.jpg&quot;</span>,</div>
                    <div className="pl-4"><span className="text-purple-400">&quot;resolvedGatewayUrl&quot;</span>: <span className="text-violet-400">&quot;https://ipfs.io/ipfs/QmbGvE3.../42.jpg&quot;</span></div>
                    <div>{`}`}</div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3.5 py-2.5 mt-2">
                    <CheckCircle2 size={12} className="shrink-0" />
                    <span>Resolved successfully. High-fidelity rendering loaded into the active inventory slot grid.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
