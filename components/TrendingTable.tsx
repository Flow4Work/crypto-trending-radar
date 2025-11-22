"use client";

import { useEffect, useMemo, useState } from "react";
import type { CoinMarket } from "@/utils/trend";
import { computeTrendScore, momentumReason, trendLabel } from "@/utils/trend";
import { RefreshBadge } from "./RefreshBadge";
import { NewExploding } from "./NewExploding";
import { DailyFocus } from "./DailyFocus";

interface Props {
  markets: CoinMarket[];
  lastUpdated: number | null;
}

export function TrendingTable({ markets, lastUpdated }: Props) {
  const [sortKey, setSortKey] = useState<"score" | "volume" | "mcap">("score");

  const computed = useMemo(() => {
    const withScore = markets.map((c) => ({
      ...c,
      score: computeTrendScore(c)
    }));

    const sorted = [...withScore].sort((a, b) => {
      if (sortKey === "volume") return b.total_volume - a.total_volume;
      if (sortKey === "mcap") return b.market_cap - a.market_cap;
      return b.score - a.score;
    });

    return sorted.slice(0, 40);
  }, [markets, sortKey]);

  return (
    <section className="space-y-3">
      <div className="glass-panel">
        <header className="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Trending Coins
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Ranked by blended momentum, liquidity and volume.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RefreshBadge lastUpdated={lastUpdated} />
            <div className="hidden sm:flex items-center text-[10px] rounded-full bg-slate-900/70 border border-slate-700/80 overflow-hidden">
              <button
                onClick={() => setSortKey("score")}
                className={`px-2.5 py-1 ${sortKey === "score" ? "bg-accent.cyan/20 text-accent.cyan" : "text-slate-400"}`}
              >
                Trend
              </button>
              <button
                onClick={() => setSortKey("volume")}
                className={`px-2.5 py-1 ${sortKey === "volume" ? "bg-accent.cyan/20 text-accent.cyan" : "text-slate-400"}`}
              >
                Volume
              </button>
              <button
                onClick={() => setSortKey("mcap")}
                className={`px-2.5 py-1 ${sortKey === "mcap" ? "bg-accent.cyan/20 text-accent.cyan" : "text-slate-400"}`}
              >
                Mcap
              </button>
            </div>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full text-[11px] border-t border-slate-800/80">
            <thead className="text-[10px] text-slate-400">
              <tr>
                <th className="py-1.5 pl-4 text-left font-normal">Coin</th>
                <th className="py-1.5 text-right font-normal">Price</th>
                <th className="py-1.5 text-right font-normal">1h</th>
                <th className="py-1.5 text-right font-normal">24h</th>
                <th className="py-1.5 text-right font-normal">Volume</th>
                <th className="py-1.5 text-right pr-4 font-normal">
                  Trend Score
                </th>
              </tr>
            </thead>
            <tbody>
              {computed.map((coin) => {
                const oneH = coin.price_change_percentage_1h_in_currency ?? 0;
                const day =
                  coin.price_change_percentage_24h_in_currency ?? 0;
                const reason = momentumReason(coin);
                const label = trendLabel(coin.score);

                return (
                  <tr
                    key={coin.id}
                    className="border-t border-slate-800/70 hover:bg-slate-900/60 transition-colors"
                  >
                    <td className="align-top pl-4 pt-2 pb-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={coin.image}
                          alt={coin.symbol}
                          className="w-5 h-5 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">
                              {coin.name}
                            </span>
                            <span className="text-[10px] uppercase text-slate-500">
                              {coin.symbol}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {label}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="align-top text-right pt-2 pb-1.5">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td className="align-top text-right pt-2 pb-1.5">
                      <span
                        className={
                          oneH >= 0
                            ? "text-trend.positive"
                            : "text-trend.negative"
                        }
                      >
                        {oneH.toFixed(2)}%
                      </span>
                    </td>
                    <td className="align-top text-right pt-2 pb-1.5">
                      <span
                        className={
                          day >= 0
                            ? "text-trend.positive"
                            : "text-trend.negative"
                        }
                      >
                        {day.toFixed(2)}%
                      </span>
                    </td>
                    <td className="align-top text-right pt-2 pb-1.5">
                      ${(coin.total_volume / 1_000_000).toFixed(1)}M
                    </td>
                    <td className="align-top text-right pt-2 pb-1.5 pr-4">
                      <span
                        className={`badge-pill border px-2 py-0.5 ${
                          coin.score >= 0
                            ? "bg-accent.cyan/15 border-accent.cyan/40 text-accent.cyan"
                            : "bg-trend.negative/15 border-trend.negative/40 text-trend.negative"
                        }`}
                      >
                        {coin.score}
                      </span>
                      <div className="text-[9px] text-slate-500 mt-1 max-w-[220px] ml-auto">
                        {reason}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <NewExploding markets={markets} />
      <DailyFocus markets={markets} />
    </section>
  );
}
