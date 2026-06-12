"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";

import { createDealRequest } from "@/lib/request/api";

export default function RequestPage() {
  const router = useRouter();
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
        consentAccepted: true,
      });

      router.push("/thank-you");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-green-500/30">
      {/* Navbar Minimal */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-gray-300 group-hover:text-white transition-colors">
              Back
            </span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="text-white">Trade</span>
            <span className="text-green-500">Window</span>
          </div>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 relative">
        {/* Background glow */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Request a structured OTC deal
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Tell us what you want to trade. We’ll review the inquiry and
              contact you for manual coordination.
            </p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form Card */}
          <div className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
            <div className="bg-[#111] rounded-[22px] p-6 md:p-10 border border-white/5 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Contact Details */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white/90 pb-2 border-b border-white/10">
                    1. Contact Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        Name / Nickname *
                      </label>
                      <input
                        required
                        name="name"
                        type="text"
                        placeholder="Alice"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        Email Address *
                      </label>
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="alice@example.com"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        Telegram / Discord / X (Optional)
                      </label>
                      <input
                        name="social"
                        type="text"
                        placeholder="@username"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        Preferred Contact Method *
                      </label>
                      <select
                        required
                        name="preferredContact"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all appearance-none"
                      >
                        <option value="email">Email</option>
                        <option value="telegram">Telegram</option>
                        <option value="discord">Discord</option>
                        <option value="x">X (Twitter)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Deal Details */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white/90 pb-2 border-b border-white/10">
                    2. Deal Inquiry
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        Request Type *
                      </label>
                      <select
                        required
                        name="requestType"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all appearance-none"
                      >
                        <option value="" disabled selected hidden>
                          Select type...
                        </option>
                        <option value="Buy">Buy</option>
                        <option value="Sell">Sell</option>
                        <option value="Swap">Swap</option>
                        <option value="OTC bundle">OTC bundle</option>
                        <option value="NFT / game asset / RWA inquiry">
                          NFT / game asset / RWA inquiry
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        Chain / Ecosystem *
                      </label>
                      <select
                        required
                        name="chain"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all appearance-none"
                      >
                        <option value="" disabled selected hidden>
                          Select chain...
                        </option>
                        <option value="Gno.land">Gno.land</option>
                        <option value="AtomOne">AtomOne</option>
                        <option value="Cosmos / IBC">Cosmos / IBC</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        Asset you offer *
                      </label>
                      <input
                        required
                        name="assetOffer"
                        type="text"
                        placeholder="e.g. 1000 USDC"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        Asset you want *
                      </label>
                      <input
                        required
                        name="assetWant"
                        type="text"
                        placeholder="e.g. GNO Tokens"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">
                      Approximate amount / range *
                    </label>
                    <input
                      required
                      name="amount"
                      type="text"
                      placeholder="e.g. $10k - $50k"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">
                      Message / Deal Details
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Describe the context of the deal, any specific requirements, or deadlines..."
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>

                {/* 3. Consent */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-6">
                      <input
                        required
                        type="checkbox"
                        className="w-5 h-5 rounded border-white/20 bg-black/50 text-green-500 focus:ring-green-500/50 focus:ring-offset-0 cursor-pointer"
                      />
                    </div>
                    <div className="text-sm text-gray-400 leading-relaxed">
                      I understand that Trade Window is currently an
                      MVP/research prototype and does not provide custody,
                      financial advice, guaranteed execution or real settlement.
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                >
                  {isSubmitting ? (
                    "Preparing Draft..."
                  ) : (
                    <>
                      Prepare Email Draft
                      <Send className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-500 mt-4">
                  This will generate an email draft for you to review and send manually.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
