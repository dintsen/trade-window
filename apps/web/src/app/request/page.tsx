"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Mail, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/lib/wallet/wallet-store";
import { createDealRequest } from "@/lib/request/api";

const inputCls =
  "w-full bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#3ECF8E]/40 transition-colors text-sm";

const selectCls =
  "w-full bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#3ECF8E]/40 transition-colors appearance-none text-sm";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em] shrink-0">
        {children}
      </p>
      <div className="flex-1 h-px bg-[#1c1c1c]" />
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs text-white/40 font-medium mb-1.5">{children}</label>
  );
}

export default function RequestPage() {
  const router = useRouter();
  const { account } = useWalletStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await createDealRequest({
        name: data.name as string,
        email: data.email as string,
        contactHandle: data.social as string,
        preferredContact: data.preferredContact as string,
        requestType: data.requestType as string,
        chain: data.chain as string,
        offerAsset: data.assetOffer as string,
        wantAsset: data.assetWant as string,
        amountRange: data.amount as string,
        message: data.message as string,
        requesterWallet: account?.address,
        consentAccepted: true,
      });

      router.push("/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#3ECF8E]/20">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#1c1c1c] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/30 hover:text-white/60 transition-colors p-1">
              <ChevronLeft size={16} />
            </Link>
            <div className="w-px h-4 bg-[#1c1c1c]" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Mail size={12} className="text-amber-400" />
              </div>
              <span className="font-semibold text-sm text-white/80">Private Request</span>
            </div>
          </div>
          <Link
            href="/board"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-white/40 hover:text-white/70 transition-colors"
          >
            Browse OTC Board →
          </Link>
        </div>
      </nav>

      <main className="pt-20 pb-24 px-6">
        <div className="max-w-2xl mx-auto pt-10">

          {/* Header */}
          <div className="mb-8">
            <p className="text-[10px] font-mono text-[#3ECF8E] uppercase tracking-[0.15em] mb-3">
              Private Request
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Request a structured OTC deal
            </h1>
            <p className="text-sm text-white/40 leading-relaxed">
              Tell us what you want to trade. We&apos;ll review the inquiry and contact you for manual coordination.
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-[#0c0c0c] border border-[#1c1c1c] rounded-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* 1. Contact Details */}
              <div>
                <SectionLabel>Contact Details</SectionLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Name / Nickname *</FieldLabel>
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="Alice"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel>Email Address *</FieldLabel>
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="alice@example.com"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel>Telegram / Discord / X (optional)</FieldLabel>
                    <input
                      name="social"
                      type="text"
                      placeholder="@username"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel>Preferred Contact Method *</FieldLabel>
                    <select required name="preferredContact" className={selectCls}>
                      <option value="email">Email</option>
                      <option value="telegram">Telegram</option>
                      <option value="discord">Discord</option>
                      <option value="x">X (Twitter)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Deal Details */}
              <div>
                <SectionLabel>Deal Inquiry</SectionLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel>Request Type *</FieldLabel>
                    <select required name="requestType" defaultValue="" className={selectCls}>
                      <option value="" disabled hidden>Select type...</option>
                      <option value="Buy">Buy</option>
                      <option value="Sell">Sell</option>
                      <option value="Swap">Swap</option>
                      <option value="OTC bundle">OTC bundle</option>
                      <option value="NFT / game asset / RWA inquiry">NFT / game asset / RWA</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Chain / Ecosystem *</FieldLabel>
                    <select required name="chain" defaultValue="" className={selectCls}>
                      <option value="" disabled hidden>Select chain...</option>
                      <option value="Gno.land">Gno.land</option>
                      <option value="AtomOne">AtomOne</option>
                      <option value="Cosmos / IBC">Cosmos / IBC</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Asset you offer *</FieldLabel>
                    <input
                      required
                      name="assetOffer"
                      type="text"
                      placeholder="e.g. 1000 USDC"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel>Asset you want *</FieldLabel>
                    <input
                      required
                      name="assetWant"
                      type="text"
                      placeholder="e.g. GNO tokens"
                      className={inputCls}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <FieldLabel>Approximate amount / range *</FieldLabel>
                  <input
                    required
                    name="amount"
                    type="text"
                    placeholder="e.g. $10k – $50k"
                    className={inputCls}
                  />
                </div>
                <div>
                  <FieldLabel>Message / Deal Details</FieldLabel>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Describe the context, any specific requirements, or deadlines..."
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>

              {/* 3. Consent */}
              <div className="bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    required
                    type="checkbox"
                    className="mt-0.5 w-4 h-4 shrink-0 cursor-pointer accent-[#3ECF8E]"
                  />
                  <p className="text-xs text-white/40 leading-relaxed">
                    I understand that Trade Window is currently an MVP/research prototype and does not provide custody,
                    financial advice, guaranteed execution or real settlement.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#3ECF8E] hover:bg-[#4ADBA0] text-black font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? (
                  "Preparing Draft..."
                ) : (
                  <>
                    Prepare Email Draft
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-white/20 -mt-4">
                This will generate an email draft for you to review and send manually.
              </p>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
