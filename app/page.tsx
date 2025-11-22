"use client";

import { useEffect, useState } from "react";
import type { CoinMarket } from "@/utils/trend";
import { Watchlist } from "@/components/Watchlist";
import { TrendingTable } from "@/components/TrendingTable";
import { SectorHeatmap } from "@/components/SectorHeatmap";
import { NotesCard } from "@/components/NotesCard";

export default function HomePage() {
  const [markets, setMarkets] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [fade, setFade] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/markets");
      if (!res.ok) return;
      const data = await res.json();
      setFade(true);
      setMarkets(data);
      setLastUpdated(Date.now());
      setTimeout(() => setFade(false), 700);
    } catch {
      // ignore for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-accent.cyan/40 bg-slate-900/80 px-3 py-1.5 shadow-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] tracking-wide text-accent.cyan">
              Crypto Trending Radar
            </span>
          </div>
          <h1 className="mt-3 text-xl sm:text-2xl font-semibold text-slate-50">
            Map today&apos;s crypto momentum in one glance.
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl">
            Personal Web3 dashboard powered by CoinGecko · auto-refresh every
            30s · local-only watchlist &amp; notes.
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-slate-400">
          <div>
            Data source{" "}
            <a
              href="https://www.coingecko.com/"
              target="_blank"
              className="text-accent.cyan hover:underline"
            >
              CoinGecko
            </a>
          </div>
          <div className="text-[11px] bg-slate-900/80 border border-slate-700/80 rounded-full px-3 py-1">
            Dark mode only · built for 16:9 &amp; mobile
          </div>
        </div>
      </header>

      <div
        className={`grid gap-4 lg:gap-5 ${
          fade ? "animate-fadePulse" : ""
        } grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.8fr)_minmax(0,1.2fr)]`}
      >
        <div className="space-y-4">
          <Watchlist markets={markets} />
        </div>

        <div className="space-y-4">
          <TrendingTable markets={markets} lastUpdated={lastUpdated} />
        </div>

        <div className="space-y-4">
          <SectorHeatmap markets={markets} />
          <NotesCard />
        </div>
      </div>

      {loading && (
        <div className="fixed inset-x-0 bottom-4 flex justify-center pointer-events-none">
          <div className="pointer-events-auto rounded-full bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 text-[11px] text-slate-300 shadow-lg flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent.cyan animate-pulse" />
            <span>Bootstrapping market data from CoinGecko...</span>
          </div>
        </div>
      )}
    </main>
  );
}
