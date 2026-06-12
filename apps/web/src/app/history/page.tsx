"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, Clock, Activity, CheckCircle, XCircle, ExternalLink } from "lucide-react";
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
        setError("Failed to load trade history. Note: Wallet history is currently in MVP and requires the Postgres backend driver.");
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
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "draft":
      case "listed":
      case "requested":
        return <Clock className="w-4 h-4 text-zinc-400" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">My Trades</h1>
        {account?.address && (
          <span className="font-mono text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5">
            {account.address.slice(0, 10)}...{account.address.slice(-4)}
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-500 mb-8">
        Your listings, private requests and trade rooms — coordination history only. Mainnet settlement is disabled.
      </p>

      {!account?.address ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <Wallet className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-zinc-200 mb-2">Connect Wallet to View History</h2>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Your trade history is associated with your connected wallet address. Connect your wallet to view your listings, requests, and trade rooms.
          </p>
          <Link
            href="/trade"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg transition-colors font-medium"
          >
            <Wallet className="w-4 h-4" /> Connect in Trade Room
          </Link>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          <Activity className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-zinc-200 mb-2">No Trades Found</h2>
          <p className="text-zinc-400 mb-6">
            You haven&apos;t created any listings or participated in any trades yet.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/board/new"
              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors font-medium"
            >
              Create Listing
            </Link>
            <Link
              href="/board"
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg transition-colors font-medium"
            >
              Browse Board
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mb-6">
            <h3 className="text-yellow-400 font-medium mb-1">MVP Notice</h3>
            <p className="text-yellow-500/80 text-sm">
              Wallet history filtering is currently in MVP mode. True cryptographic authentication and Gno.land on-chain receipts are coming in a future update. No private data is exposed in this view.
            </p>
          </div>
          
          {items.map((item) => (
            <div key={`${item.type}-${item.id}`} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 text-xs font-medium uppercase tracking-wider bg-zinc-800 text-zinc-300 rounded-full">
                      {item.type}
                    </span>
                    <span className="px-2.5 py-1 text-xs font-medium uppercase tracking-wider bg-zinc-800 text-zinc-300 rounded-full">
                      {item.role.replace("_", " ")}
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-950 rounded-full border border-zinc-800">
                      {getStatusIcon(item.status)}
                      <span className="text-xs font-medium capitalize text-zinc-300">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    {item.assetPair && (
                      <p className="text-lg font-medium text-zinc-100">
                        {item.assetPair} {item.amount && <span className="text-zinc-500 text-sm font-normal ml-2">({item.amount})</span>}
                      </p>
                    )}
                    {item.counterparty && (
                      <p className="text-sm text-zinc-400 mt-1">
                        Counterparty: <span className="font-mono text-zinc-300">{item.counterparty.slice(0, 8)}...{item.counterparty.slice(-4)}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between items-start sm:items-end text-sm">
                  <span className="text-zinc-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  
                  <div className="mt-4 flex gap-2">
                    {item.type === "room" && (
                      <Link
                        href={`/trade?room=${item.id}`}
                        className="px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors font-medium text-sm border border-emerald-500/20"
                      >
                        Enter Room
                      </Link>
                    )}
                    {item.commitmentHash && (
                      <span
                        title={item.commitmentHash}
                        className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-lg text-sm font-mono flex items-center gap-2 border border-zinc-700"
                      >
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        Commitment {item.commitmentHash.slice(0, 8)}…
                      </span>
                    )}
                    {item.txHash && (
                      <span
                        title={`Explorer link coming with the Gno.land receipt layer. Tx: ${item.txHash}`}
                        className="px-3 py-1.5 bg-zinc-800 text-zinc-400 rounded-lg text-sm font-mono flex items-center gap-2 border border-zinc-700"
                      >
                        <ExternalLink className="w-3 h-3 text-zinc-500" />
                        Tx {item.txHash.slice(0, 8)}…
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
