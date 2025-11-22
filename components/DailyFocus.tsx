"use client";

import { useMemo } from "react";
import type { CoinMarket } from "@/utils/trend";
import { computeTrendScore, momentumReason } from "@/utils/trend";

interface Props {
  markets: CoinMarket[];
}

export function DailyFocus({ markets }: Props) {
  const picks = useMemo(() => {
    const eligible = markets.filter(
      (c) => (c.price_change_percentage_1h_in_currency ?? 0) > 1
    );
    const sorted = [...eligible].sort((a, b) => {
      const sa = computeTrendScore(a);
      const sb = computeTrendScore(b);
      return sb - sa;
    });
    return sorted.slice(0, 3);
  }, [markets]);

  return (
    <section className="glass-panel">
      <header className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Daily Focus
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Auto-selected coins with strong intraday momentum.
          </p>
        </div>
        <span className="badge-pill bg-accent.indigo/10 text-accent.indigo border border-accent.indigo/40">
          1h Momentum
        </span>
      </header>
      <div className="px-3 pb-3 space-y-2">
        {picks.length === 0 && (
          <div className="text-xs text-slate-500 px-1 pb-3">
            No standout intraday movers yet. Market is catching its breath.
          </div>
        )}
        {picks.map((coin) => {
          const oneH = coin.price_change_percentage_1h_in_currency ?? 0;
          const day = coin.price_change_percentage_24h_in_currency ?? 0;
          const score = computeTrendScore(coin);
          const reason = momentumReason(coin);

          return (
            <div
              key={coin.id}
              className="rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 py-2.5 flex gap-3"
            >
              <img
                src={coin.image}
                alt={coin.symbol}
                className="w-7 h-7 rounded-full mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="truncate text-xs font-medium">
                      {coin.name}
                    </div>
                    <span className="text-[10px] uppercase text-slate-500">
                      {coin.symbol}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold">
                      ${coin.current_price.toLocaleString()}
                    </div>
                    <div className="text-[10px] space-x-1">
                      <span
                        className={
                          oneH >= 0
                            ? "text-trend.positive"
                            : "text-trend.negative"
                        }
                      >
                        1h {oneH.toFixed(2)}%
                      </span>
                      <span className="text-slate-500">·</span>
                      <span
                        className={
                          day >= 0
                            ? "text-trend.positive"
                            : "text-trend.negative"
                        }
                      >
                        24h {day.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {reason}
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300">
                    Trend {score}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
