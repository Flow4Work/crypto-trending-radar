"use client";

import { useEffect, useMemo, useState } from "react";
import { sectorHeatScore } from "@/utils/trend";
import type { CoinMarket } from "@/utils/trend";
import { SectorModal } from "./SectorModal";

interface Category {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number;
  top_3_coins: string[];
  volume_24h: number;
}

interface Props {
  markets: CoinMarket[];
}

export function SectorHeatmap({ markets }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Category | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) return;
        const data = await res.json();
        setCategories(data);
      } catch {
        // ignore
      }
    };
    fetchCategories();
  }, []);

  const extended = useMemo(() => {
    return categories.slice(0, 12).map((cat) => {
      const avgChange =
        typeof cat.market_cap_change_24h === "number"
          ? cat.market_cap_change_24h
          : 0;
      const volRatio = cat.volume_24h / (cat.market_cap || 1);
      const heat = sectorHeatScore(avgChange, volRatio);
      return { ...cat, heat, avgChange, volRatio };
    });
  }, [categories]);

  return (
    <section className="glass-panel relative h-full flex flex-col">
      <header className="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Sector Heatmap
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Where is liquidity aggressively rotating today?
          </p>
        </div>
        <span className="badge-pill bg-slate-900/80 text-slate-300 border border-slate-700/80 text-[10px]">
          By CoinGecko categories
        </span>
      </header>
      <div className="px-3 pb-3 grid grid-cols-2 md:grid-cols-3 gap-2.5 flex-1">
        {extended.length === 0 && (
          <div className="text-xs text-slate-500 px-2 py-4 col-span-full">
            Loading sector data from CoinGecko...
          </div>
        )}
        {extended.map((cat) => {
          const intensity = Math.min(Math.abs(cat.heat), 100) / 100;
          const bg =
            cat.heat >= 0
              ? `rgba(34, 197, 94, ${0.2 + intensity * 0.35})`
              : `rgba(248, 113, 113, ${0.18 + intensity * 0.32})`;
          const barWidth = Math.min(100, 50 + intensity * 50);

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelected(cat);
                setModalOpen(true);
              }}
              className="rounded-2xl border border-slate-700/80 bg-slate-900/70 px-3 py-2.5 text-left flex flex-col gap-1.5 hover:border-accent.cyan/60 hover:shadow-glow transition-all"
              style={{ boxShadow: `0 0 25px rgba(15, 23, 42, 0.9)` }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-medium truncate">
                  {cat.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  ${(cat.market_cap / 1_000_000_0).toFixed(1)}B Mcap
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span
                  className={
                    cat.avgChange >= 0
                      ? "text-trend.positive"
                      : "text-trend.negative"
                  }
                >
                  24h {cat.avgChange.toFixed(1)}%
                </span>
                <span className="text-slate-400">
                  Heat {cat.heat}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={
                    cat.heat >= 0 ? "bg-trend.positive" : "bg-trend.negative"
                  }
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
      {selected && (
        <SectorModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          category={selected}
          markets={markets}
        />
      )}
    </section>
  );
}
