"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, RefreshCw, AlertTriangle, LayoutGrid, ArrowRight, ChevronLeft } from "lucide-react";
import { PublicBoardListing } from "@/lib/board/types";
import { fetchListings } from "@/lib/board/api";
import { getAsset } from "@/lib/assets/asset-registry";

function AssetCell({ denom }: { denom: string }) {
  const asset = getAsset(denom);
  if (asset) {
    return (
      <span className="flex items-center gap-1.5">
        <Image src={asset.logoUrl} width={16} height={16} className="w-4 h-4 rounded-full shrink-0" alt="" />
        <span className="font-medium text-white/80">{asset.symbol}</span>
        {asset.isDemo && (
          <span className="text-[10px] text-white/30 bg-white/5 px-1 py-0.5 rounded font-mono">demo</span>
        )}
      </span>
    );
  }
  return <span className="text-white/60 font-mono text-xs">{denom}</span>;
}

const TYPE_FILTERS = ["All", "Buy", "Sell", "Swap", "OTC Bundle", "NFT_Game_RWA"];
const CHAIN_FILTERS = ["All", "Gno", "AtomOne", "Cosmos / IBC", "Other"];

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
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#3ECF8E]/20">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#1c1c1c] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/30 hover:text-white/60 transition-colors p-1">
              <ChevronLeft size={16} />
            </Link>
            <div className="w-px h-4 bg-[#1c1c1c]" />
            <Link href="/board" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 flex items-center justify-center shrink-0">
                <LayoutGrid size={12} className="text-[#3ECF8E]" />
              </div>
              <span className="font-semibold text-sm text-white/80">OTC Board</span>
            </Link>
          </div>
          <Link
            href="/board/new"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold bg-[#3ECF8E] hover:bg-[#4ADBA0] text-black px-3.5 py-1.5 rounded-md transition-colors"
          >
            <Plus size={13} /> Post Listing
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full lg:w-56 shrink-0 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">OTC Board</h1>
            <p className="text-sm text-white/40 leading-relaxed mb-5">
              Discover public deal intents and request manual OTC coordination.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/board/new"
                className="w-full text-center text-sm font-semibold bg-[#3ECF8E] hover:bg-[#4ADBA0] text-black px-4 py-2.5 rounded-lg transition-all"
              >
                Post a Deal
              </Link>
              <Link
                href="/request"
                className="w-full text-center text-sm font-medium bg-transparent border border-[#2b2b2b] hover:border-[#3b3b3b] hover:bg-white/[0.03] text-white/70 px-4 py-2.5 rounded-lg transition-all"
              >
                Private Request
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#0c0c0c] border border-[#1c1c1c] rounded-lg overflow-hidden">
            {/* Type filter */}
            <div className="px-3 py-2.5 border-b border-[#1c1c1c]">
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.12em] mb-2">Request Type</p>
              <div className="flex flex-col gap-0.5">
                {TYPE_FILTERS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`text-left px-2 py-1.5 rounded-md text-xs transition-colors ${
                      typeFilter === t
                        ? "bg-[#3ECF8E]/10 text-[#3ECF8E] font-medium"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white/70"
                    }`}
                  >
                    {t.replace(/_/g, " / ")}
                  </button>
                ))}
              </div>
            </div>
            {/* Chain filter */}
            <div className="px-3 py-2.5">
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.12em] mb-2">Ecosystem</p>
              <div className="flex flex-col gap-0.5">
                {CHAIN_FILTERS.map(c => (
                  <button
                    key={c}
                    onClick={() => setChainFilter(c)}
                    className={`text-left px-2 py-1.5 rounded-md text-xs transition-colors ${
                      chainFilter === c
                        ? "bg-[#3ECF8E]/10 text-[#3ECF8E] font-medium"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white/70"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/15 rounded-lg px-4 py-3 text-xs text-amber-200/60">
            <AlertTriangle className="shrink-0 text-amber-500/50 mt-0.5" size={14} />
            <p>
              Listings are public deal intents only. Trade Window does not custody assets, execute trades, provide financial advice or guarantee settlement.
            </p>
          </div>

          {/* States */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-white/30">
              <RefreshCw className="animate-spin mb-3" size={20} />
              <span className="text-sm font-mono">Loading listings…</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-rose-400/70 bg-rose-500/5 border border-rose-500/10 rounded-xl">
              <AlertTriangle className="mb-3" size={20} />
              <p className="text-sm mb-3">{error}</p>
              <button
                onClick={loadListings}
                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white border border-[#2b2b2b]"
              >
                Retry
              </button>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#0c0c0c] border border-[#1c1c1c] rounded-xl text-white/30">
              <p className="text-sm mb-1">No listings found</p>
              <p className="text-xs text-white/20">Try adjusting your filters or be the first to post.</p>
            </div>
          ) : (
            /* Listings table */
            <div className="bg-[#0c0c0c] border border-[#1c1c1c] rounded-xl overflow-hidden">
              {/* Table head */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto_auto] gap-4 px-5 py-2.5 border-b border-[#1c1c1c] bg-[#0a0a0a]">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.12em]">Title</span>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.12em]">Offering</span>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.12em]">Wanting</span>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.12em]">Amount</span>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.12em]">Date</span>
              </div>

              {filteredListings.map((listing, idx) => (
                <div
                  key={listing.id}
                  className={`group flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_auto_auto] gap-2 md:gap-4 px-5 py-4 hover:bg-[#111111] transition-colors ${
                    idx < filteredListings.length - 1 ? 'border-b border-[#1c1c1c]' : ''
                  }`}
                >
                  {/* Title column */}
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="text-sm font-medium text-white/80 group-hover:text-white truncate transition-colors">
                      {listing.title}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#1a1a1a] border border-[#2b2b2b] text-white/40 rounded capitalize">
                        {listing.requestType.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#1a1a1a] border border-[#2b2b2b] text-white/30 rounded">
                        {listing.chain}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#3ECF8E]/8 border border-[#3ECF8E]/20 text-[#3ECF8E]/70 rounded font-mono uppercase">
                        {listing.status}
                      </span>
                    </div>
                    {/* Mobile: show extra info inline */}
                    {(listing.publicMessage || listing.publicContact) && (
                      <div className="md:hidden flex flex-col gap-1 mt-1">
                        {listing.publicContact && (
                          <span className="text-xs text-[#3ECF8E]/70 font-mono">
                            {listing.publicContact}
                            <span className="text-white/30 ml-1">via {listing.contactMethod || 'other'}</span>
                          </span>
                        )}
                        {listing.publicMessage && (
                          <span className="text-xs text-white/40 leading-relaxed">{listing.publicMessage}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Offering */}
                  <div className="flex items-center">
                    <AssetCell denom={listing.offerAsset} />
                  </div>

                  {/* Arrow + Wanting */}
                  <div className="flex items-center gap-2">
                    <ArrowRight size={12} className="text-white/20 shrink-0 hidden md:block" />
                    <AssetCell denom={listing.wantAsset} />
                  </div>

                  {/* Amount */}
                  <div className="flex items-center">
                    <span className="text-xs text-white/50 font-mono">{listing.amountRange || '—'}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center">
                    <span className="text-xs text-white/30 font-mono whitespace-nowrap">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Desktop expanded info */}
                  {(listing.publicMessage || listing.publicContact) && (
                    <div className="hidden md:flex col-span-5 pt-3 border-t border-[#1c1c1c] mt-1 gap-6 text-xs">
                      {listing.publicContact && (
                        <div className="flex gap-2 items-baseline">
                          <span className="text-white/30 font-mono uppercase tracking-wide text-[10px]">Contact</span>
                          <span className="text-[#3ECF8E]/80 font-medium">{listing.publicContact}</span>
                          <span className="text-white/25 text-[10px]">via {listing.contactMethod || 'other'}</span>
                        </div>
                      )}
                      {listing.publicMessage && (
                        <div className="flex gap-2 items-baseline min-w-0">
                          <span className="text-white/30 font-mono uppercase tracking-wide text-[10px] shrink-0">Note</span>
                          <span className="text-white/50 leading-relaxed truncate">{listing.publicMessage}</span>
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
