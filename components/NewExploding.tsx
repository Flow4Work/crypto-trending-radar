"use client";

import type { CoinMarket } from "@/utils/trend";
import { isNewAndExploding, computeTrendScore } from "@/utils/trend";
import { useMemo } from "react";

interface Props {
  markets: CoinMarket[];
}

export function NewExploding({ markets }: Props) {
  const picks = useMemo(
    () => markets.filter(isNewAndExploding).slice(0, 8),
    [markets]
  );

  return (
    <section className="glass-panel">
      <header className="px-4 pt-4 pb-2 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            New &amp; Exploding
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Fresh narratives with aggressive flows. High risk · DYOR.
          </p>
        </div>
        <span className="badge-pill bg-trend.negative/10 text-trend.negative border border-trend.negative/40 text-[10px]">
          High Risk · DYOR
        </span>
      </header>
      <div className="px-3 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {picks.length === 0 && (
          <div className="text-xs text-slate-500 px-1 pb-3">
            No stand-out small caps right now. Speculative flow is calm.
          </div>
        )}
        {picks.map((coin) => {
          const score = computeTrendScore(coin);
          const oneH = coin.price_change_percentage_1h_in_currency ?? 0;
          const day = coin.price_change_percentage_24h_in_currency ?? 0;
          const volRatio = coin.total_volume / (coin.market_cap || 1);

          return (
            <div
              key={coin.id}
              className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={coin.image}
                    alt={coin.symbol}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium">
                      {coin.name}
                    </div>
                    <div className="text-[10px] uppercase text-slate-500">
                      {coin.symbol}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold">
                    ${coin.current_price.toLocaleString()}
                  </div>
                  <div className="text-[10px]">
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
              <div className="flex items-center justify-between text-[10px]">
                <div className="space-x-2">
                  <span
                    className={
                      oneH >= 0
                        ? "text-trend.positive"
                        : "text-trend.negative"
                    }
                  >
                    1h {oneH.toFixed(2)}%
                  </span>
                  <span className="text-slate-500">
                    Vol/Mcap {(volRatio * 100).toFixed(1)}%
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-200">
                  Score {score}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
