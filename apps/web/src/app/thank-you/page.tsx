import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-8 relative z-10">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.15)]">
          <svg
            className="w-10 h-10 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Inquiry Draft Ready
          </h1>
          <p className="text-lg text-white/50">
            Thank you for providing your deal request details. We will review
            your inquiry and contact you for manual coordination if there is a
            match.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <p className="text-sm text-white/50">
            Trade Window is currently an MVP/research prototype. Submitting an
            inquiry does not execute a trade, reserve liquidity, provide
            custody, or guarantee settlement.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="h-12 px-8 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-medium group"
          >
            <ArrowLeft className="w-4 h-4 text-white/50 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <Link
            href="/trade"
            className="h-12 px-8 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500/80 to-emerald-600/80 hover:from-emerald-500 hover:to-emerald-600 text-white transition-colors font-medium"
          >
            Go to Trade Room
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
