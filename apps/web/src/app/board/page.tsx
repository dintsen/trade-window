"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, RefreshCw, AlertTriangle, Filter, LayoutGrid } from "lucide-react";
import { PublicBoardListing } from "@/lib/board/types";
import { fetchListings } from "@/lib/board/api";
import { getAsset } from "@/lib/assets/asset-registry";

export default function BoardPage() {
  const [listings, setListings] = useState<PublicBoardListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [chainFilter, setChainFilter] = useState<string>("All");

  const loadListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchListings();
      setListings(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadListings();
  }, []);

  const filteredListings = listings.filter((l) => {
    if (typeFilter !== "All" && l.requestType.toLowerCase() !== typeFilter.toLowerCase()) return false;
    if (chainFilter !== "All" && l.chain.toLowerCase() !== chainFilter.toLowerCase() && !(chainFilter === "Cosmos / IBC" && l.chain === "cosmos_ibc")) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-emerald-500/30">
      {/* Navbar Minimal */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Product logo — OTC Board */}
          <Link href="/board" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-500/10 flex items-center justify-center shrink-0 border border-white/5">
              <LayoutGrid size={14} className="text-emerald-400" />
            </div>
            <span className="font-bold tracking-tight text-base leading-none text-emerald-400">OTC Board</span>
          </Link>
          <div className="w-24 flex justify-end">
            <Link href="/board/new" className="hidden sm:flex text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1.5 rounded-full items-center gap-1 transition-colors">
              <Plus size={14} /> Post
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6 relative max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar / Filters */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">OTC Board</h1>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Discover public deal intents and request manual OTC coordination.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/board/new" className="w-full text-center font-semibold bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                Post a Deal
              </Link>
              <Link href="/request" className="w-full text-center font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-3 rounded-xl transition-all">
                Submit Private Request
              </Link>
            </div>
          </div>

          <div className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
                <Filter size={14} /> Request Type
              </div>
              <div className="flex flex-col gap-1">
                {["All", "Buy", "Sell", "Swap", "OTC Bundle", "NFT_Game_RWA"].map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)} className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${typeFilter === t ? "bg-emerald-500/10 text-emerald-400 font-medium" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
                    {t.replace(/_/g, " / ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
                <Filter size={14} /> Ecosystem
              </div>
              <div className="flex flex-col gap-1">
                {["All", "Gno", "AtomOne", "Cosmos / IBC", "Other"].map(c => (
                  <button key={c} onClick={() => setChainFilter(c)} className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${chainFilter === c ? "bg-emerald-500/10 text-emerald-400 font-medium" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex gap-3 text-sm text-amber-200/80">
            <AlertTriangle className="shrink-0 text-amber-500" size={20} />
            <p>
              Listings are public deal intents only. Trade Window does not custody assets, execute trades, provide financial advice or guarantee settlement.
            </p>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-white/40">
              <RefreshCw className="animate-spin mb-4" size={24} />
              Loading listings...
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-rose-400/80 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
              <AlertTriangle className="mb-4" size={24} />
              {error}
              <button onClick={loadListings} className="mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white">Retry</button>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white/5 border border-white/5 rounded-2xl text-white/40">
              <div className="text-lg mb-2">No listings found</div>
              <p className="text-sm">Try adjusting your filters or be the first to post.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredListings.map(listing => (
                <div key={listing.id} className="bg-[#111] hover:bg-[#151515] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-colors group">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{listing.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2.5 py-1 bg-white/10 text-white/80 rounded-full font-medium capitalize">{listing.requestType.replace(/_/g, " ")}</span>
                        <span className="px-2.5 py-1 bg-white/5 text-white/60 rounded-full">{listing.chain}</span>
                        <span className="text-white/30">{new Date(listing.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold uppercase tracking-wider">
                        {listing.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/50 border border-white/5 rounded-xl p-4">
                      <div className="text-xs text-white/40 mb-1 uppercase tracking-wider font-semibold">Offering</div>
                      <div className="text-lg font-medium text-white flex items-center gap-2">
                        {(() => {
                          const asset = getAsset(listing.offerAsset);
                          if (asset) {
                            return <><Image src={asset.logoUrl} width={20} height={20} className="w-5 h-5 rounded-full" alt="" /> <span>{asset.symbol}</span> {asset.isDemo && <span className="text-xs text-white/30 bg-white/5 px-1.5 py-0.5 rounded">Demo</span>}</>;
                          }
                          return listing.offerAsset;
                        })()}
                      </div>
                    </div>
                    <div className="bg-black/50 border border-white/5 rounded-xl p-4">
                      <div className="text-xs text-white/40 mb-1 uppercase tracking-wider font-semibold">Wanting</div>
                      <div className="text-lg font-medium text-white flex items-center gap-2">
                        {(() => {
                          const asset = getAsset(listing.wantAsset);
                          if (asset) {
                            return <><Image src={asset.logoUrl} width={20} height={20} className="w-5 h-5 rounded-full" alt="" /> <span>{asset.symbol}</span> {asset.isDemo && <span className="text-xs text-white/30 bg-white/5 px-1.5 py-0.5 rounded">Demo</span>}</>;
                          }
                          return listing.wantAsset;
                        })()}
                      </div>
                    </div>
                  </div>

                  {(listing.amountRange || listing.publicMessage || listing.publicContact) && (
                    <div className="border-t border-white/5 pt-4 flex flex-col gap-3 text-sm">
                      {listing.amountRange && (
                        <div className="flex gap-2">
                          <span className="text-white/40 w-24 shrink-0">Amount:</span>
                          <span className="text-white/90 font-medium">{listing.amountRange}</span>
                        </div>
                      )}
                      {listing.publicContact && (
                        <div className="flex gap-2">
                          <span className="text-white/40 w-24 shrink-0">Contact:</span>
                          <span className="text-emerald-400 font-medium">{listing.publicContact} <span className="text-white/30 text-xs">via {listing.contactMethod || 'unknown'}</span></span>
                        </div>
                      )}
                      {listing.publicMessage && (
                        <div className="flex gap-2">
                          <span className="text-white/40 w-24 shrink-0">Message:</span>
                          <span className="text-white/80 leading-relaxed">{listing.publicMessage}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
