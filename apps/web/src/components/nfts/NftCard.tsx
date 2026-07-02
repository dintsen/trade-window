"use client";

import { WalletNft } from "@/lib/wallet/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageOff } from "lucide-react";
import { useState } from "react";

interface NftCardProps {
  nft: WalletNft;
  selected?: boolean;
  onSelect?: (nft: WalletNft) => void;
}

export function NftCard({ nft, selected, onSelect }: NftCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`flex flex-col rounded-xl border overflow-hidden transition-all cursor-pointer group
        ${selected
          ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]"
          : "border-white/5 bg-black/20 hover:border-white/10"
        }`}
      onClick={() => onSelect?.(nft)}
    >
      {/* Image */}
      <div className="aspect-square bg-white/5 relative flex items-center justify-center overflow-hidden">
        {nft.imageUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={nft.imageUrl}
            alt={nft.name ?? nft.tokenId}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-white/20">
            <ImageOff className="w-6 h-6" />
            <span className="text-[9px]">No image</span>
          </div>
        )}
        {selected && (
          <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] text-white/40 truncate">{nft.collectionName}</span>
          <Badge variant="outline" className="text-[8px] border-pink-500/20 text-pink-400/70 bg-pink-500/5 shrink-0">
            Stargaze
          </Badge>
        </div>
        <p className="text-xs font-medium text-white/80 truncate">
          {nft.name ?? `#${nft.tokenId}`}
        </p>
        {onSelect && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); onSelect(nft); }}
            className={`w-full mt-1 h-6 text-[10px] px-2
              ${selected
                ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
          >
            {selected ? "Selected" : "Select"}
          </Button>
        )}
      </div>
    </div>
  );
}
