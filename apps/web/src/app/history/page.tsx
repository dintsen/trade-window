"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, Clock, Activity, CheckCircle, XCircle, ExternalLink, ShieldAlert } from "lucide-react";
import { Header } from "@/components/layout/header";
import { useWalletStore } from "@/lib/wallet/wallet-store";
import { fetchMyTrades } from "@/lib/history/api";
import { HistoryItem } from "@/lib/history/types";

export default function HistoryPage() {
  const { account } = useWalletStore();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!account?.address) {
      setTimeout(() => setIsLoading(false), 0);
      return;
    }

    setTimeout(() => setIsLoading(true), 0);
    fetchMyTrades(account.address)
      .then((data) => {
        setItems(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load trade history.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [account?.address]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "settled":
      case "committed":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "cancelled":
      case "failed":
      case "expired":
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case "draft":
      case "listed":
      case "requested":
        return <Clock className="w-4 h-4 text-white/40" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-emerald-500/30">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-white/90">My Trades</h1>
            <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border border-blue-500/20 text-blue-400/70">
              Preview
            </span>
            {account?.address && (
              <span className="font-mono text-xs text-white/30 bg-white/[0.04] border border-white/5 rounded-full px-3 py-1 ml-auto">
                {account.address.slice(0, 10)}…{account.address.slice(-4)}
              </span>
            )}
          </div>
          <p className="text-sm text-white/40">
            Coordination history only — listings, requests, and trade rooms. Mainnet settlement is disabled.
          </p>
        </div>

        {/* No wallet */}
        {!account?.address ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-10 text-center">
            <Wallet className="w-10 h-10 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white/70 mb-2">Connect Wallet to View History</h2>
            <p className="text-white/40 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
              Your trade history is filtered by wallet address. Connect in the Trade Room first.
            </p>
            <Link
              href="/trade"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl transition-colors font-semibold text-sm"
            >
              <Wallet className="w-4 h-4" /> Go to Trade Room
            </Link>
          </div>

        ) : isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-emerald-500/60" />
          </div>

        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
            {error}
          </div>

        ) : items.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-10 text-center">
            <Activity className="w-10 h-10 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white/70 mb-2">No Trades Found</h2>
            <p className="text-white/40 mb-8 text-sm">
              No listings or trade rooms found for this wallet address yet.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/board/new"
                className="px-5 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl transition-colors font-medium text-sm border border-white/10"
              >
                Create Listing
              </Link>
              <Link
                href="/board"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl transition-colors font-semibold text-sm"
              >
                Browse Board
              </Link>
            </div>
          </div>

        ) : (
          <div className="space-y-4">
            {/* MVP notice — subtle, honest */}
            <div className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-xs text-white/40 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-white/20 mt-0.5 shrink-0" />
              <span>
                Wallet history is filtered by address only — ownership is not cryptographically verified in this preview.
                Signature-based auth is planned. No private data is exposed in this view.
              </span>
            </div>

            {items.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 hover:bg-white/[0.03] transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-white/[0.06] text-white/50 rounded-full border border-white/5">
                        {item.type}
                      </span>
                      <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-white/[0.06] text-white/50 rounded-full border border-white/5">
                        {item.role.replace("_", " ")}
                      </span>
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-black/40 rounded-full border border-white/5">
                        {getStatusIcon(item.status)}
                        <span className="text-[10px] font-semibold capitalize text-white/50">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      {item.assetPair && (
                        <p className="text-base font-semibold text-white/80">
                          {item.assetPair}
                          {item.amount && (
                            <span className="text-white/30 text-sm font-normal ml-2">({item.amount})</span>
                          )}
                        </p>
                      )}
                      {item.counterparty && (
                        <p className="text-sm text-white/40 mt-1">
                          Counterparty:{" "}
                          <span className="font-mono text-white/50">
                            {item.counterparty.slice(0, 8)}…{item.counterparty.slice(-4)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-start sm:items-end text-xs text-white/30">
                    <span className="font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>

                    <div className="mt-4 flex gap-2">
                      {item.type === "room" && (
                        <Link
                          href={`/trade?room=${item.id}`}
                          className="px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-colors font-semibold text-xs border border-emerald-500/20"
                        >
                          Enter Room
                        </Link>
                      )}
                      {item.commitmentHash && (
                        <span
                          title={item.commitmentHash}
                          className="px-3 py-1.5 bg-white/[0.04] text-white/40 rounded-xl text-xs font-mono flex items-center gap-2 border border-white/5"
                        >
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          {item.commitmentHash.slice(0, 8)}…
                        </span>
                      )}
                      {item.txHash && (
                        <span
                          title={`Explorer link coming with the Gno.land receipt layer. Tx: ${item.txHash}`}
                          className="px-3 py-1.5 bg-white/[0.04] text-white/40 rounded-xl text-xs font-mono flex items-center gap-2 border border-white/5"
                        >
                          <ExternalLink className="w-3 h-3 text-white/20" />
                          {item.txHash.slice(0, 8)}…
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
