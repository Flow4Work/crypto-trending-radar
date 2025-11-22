"use client";

import { useMemo, useState } from "react";
import type { CoinMarket } from "@/utils/trend";
import {
  computeTrendScore,
  momentumReason,
  trendLabel,
} from "@/utils/trend";
import { RefreshBadge } from "./RefreshBadge";
import { NewExploding } from "./NewExploding";
import { DailyFocus } from "./DailyFocus";

interface Props {
  markets: CoinMarket[];
  lastUpdated: number | null;
}

function scoreToColors(score: number) {
  // -100 ~ 100 사이 가정
  if (score >= 70) {
    return {
      ring: "ring-2 ring-emerald-400/70",
      gradient:
        "from-emerald-500/40 via-emerald-400/25 to-slate-900/80",
      badge:
        "bg-emerald-500/20 border-emerald-400/60 text-emerald-200",
    };
  }
  if (score >= 40) {
    return {
      ring: "ring-2 ring-emerald-300/60",
      gradient:
        "from-emerald-400/30 via-emerald-300/20 to-slate-900/80",
      badge:
        "bg-emerald-400/15 border-emerald-300/50 text-emerald-200",
    };
  }
  if (score >= 15) {
    return {
      ring: "ring-2 ring-cyan-300/50",
      gradient: "from-cyan-400/20 via-cyan-300/15 to-slate-900/80",
      badge:
        "bg-cyan-400/15 border-cyan-300/50 text-cyan-200",
    };
  }
  if (score > -15) {
    return {
      ring: "ring-2 ring-slate-600/60",
      gradient:
        "from-slate-600/40 via-slate-800/70 to-slate-950/90",
      badge:
        "bg-slate-700/60 border-slate-500/60 text-slate-100",
    };
  }
  if (score > -40) {
    return {
      ring: "ring-2 ring-rose-400/60",
      gradient: "from-rose-500/25 via-rose-500/15 to-slate-950/90",
      badge:
        "bg-rose-500/20 border-rose-400/70 text-rose-100",
    };
  }
  if (score > -70) {
    return {
      ring: "ring-2 ring-rose-500/70",
      gradient: "from-rose-500/35 via-rose-500/20 to-slate-950/90",
      badge:
        "bg-rose-500/25 border-rose-400/80 text-rose-50",
    };
  }
  return {
    ring: "ring-2 ring-red-500/80",
    gradient: "from-red-600/40 via-red-500/25 to-slate-950/95",
    badge:
      "bg-red-600/25 border-red-400/80 text-red-50",
  };
}

export function TrendingTable({ markets, lastUpdated }: Props) {
  const [sortKey, setSortKey] = useState<"score" | "volume" | "mcap">(
    "score"
  );

  const computed = useMemo(() => {
    const withScore = markets.map((c) => ({
      ...c,
      score: computeTrendScore(c),
    }));

    const sorted = [...withScore].sort((a, b) => {
      if (sortKey === "volume") return b.total_volume - a.total_volume;
      if (sortKey === "mcap") return b.market_cap - a.market_cap;
      return b.score - a.score;
    });

    return sorted.slice(0, 36); // 상위 36개만 히트맵에
  }, [markets, sortKey]);

  return (
    <section className="space-y-4">
      {/* 헤더 + 컨트롤 */}
      <div className="glass-panel">
        <header className="px-4 pt-4 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Trending Coins Heatmap
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Blended momentum · liquidity · volume. Darker & more
              saturated tiles = stronger narrative flow.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-2 text-xs">
            <RefreshBadge lastUpdated={lastUpdated} />
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[10px] rounded-full bg-slate-900/70 border border-slate-700/80 overflow-hidden">
                <button
                  onClick={() => setSortKey("score")}
                  className={`px-2.5 py-1 ${
                    sortKey === "score"
                      ? "bg-accent.cyan/20 text-accent.cyan"
                      : "text-slate-400"
                  }`}
                >
                  Trend
                </button>
                <button
                  onClick={() => setSortKey("volume")}
                  className={`px-2.5 py-1 ${
                    sortKey === "volume"
                      ? "bg-accent.cyan/20 text-accent.cyan"
                      : "text-slate-400"
                  }`}
                >
                  Volume
                </button>
                <button
                  onClick={() => setSortKey("mcap")}
                  className={`px-2.5 py-1 ${
                    sortKey === "mcap"
                      ? "bg-accent.cyan/20 text-accent.cyan"
                      : "text-slate-400"
                  }`}
                >
                  Mcap
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* 히트맵 그리드 */}
        <div className="px-3 pb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {computed.map((coin) => {
              const oneH =
                coin.price_change_percentage_1h_in_currency ?? 0;
              const day =
                coin.price_change_percentage_24h_in_currency ?? 0;
              const vol = coin.total_volume;
              const mcap = coin.market_cap || 1;
              const volRatio = vol / mcap;
              const label = trendLabel(coin.score);
              const reason = momentumReason(coin);
              const colors = scoreToColors(coin.score);

              return (
                <div
                  key={coin.id}
                  className={`relative rounded-2xl border border-slate-700/70 bg-gradient-to-br ${colors.gradient} ${colors.ring} overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-glow`}
                >
                  {/* 상단: 코인 기본 정보 */}
                  <div className="px-3 pt-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-black/60 blur-[6px]" />
                        <img
                          src={coin.image}
                          alt={coin.symbol}
                          className="relative w-7 h-7 rounded-full border border-slate-700/80"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold truncate max-w-[110px]">
                            {coin.name}
                          </span>
                          <span className="text-[10px] uppercase text-slate-300/80">
                            {coin.symbol}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-300/80">
                          {label}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-50">
                        ${coin.current_price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-200/90 space-x-1">
                        <span
                          className={
                            oneH >= 0
                              ? "text-trend.positive"
                              : "text-trend.negative"
                          }
                        >
                          1h {oneH.toFixed(2)}%
                        </span>
                        <span className="text-slate-400">·</span>
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

                  {/* 중간: Trend Score / Volume · Mcap */}
                  <div className="px-3 mt-2 flex items-center justify-between text-[10px]">
                    <div className="space-x-1 text-slate-200/90">
                      <span className="text-slate-300/80">
                        Vol:
                      </span>
                      <span>
                        ${(vol / 1_000_000).toFixed(1)}M
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-300/80">
                        Vol/Mcap
                      </span>
                      <span>{(volRatio * 100).toFixed(1)}%</span>
                    </div>
                    <span
                      className={`badge-pill border px-2 py-0.5 text-[10px] font-semibold ${colors.badge}`}
                    >
                      Trend {coin.score}
                    </span>
                  </div>

                  {/* 하단: 작은 히트 바 + Reason */}
                  <div className="px-3 pb-3 mt-2">
                    <div className="h-1.5 w-full rounded-full bg-slate-900/50 overflow-hidden mb-1.5">
                      <div
                        className={`h-full ${
                          coin.score >= 0
                            ? "bg-gradient-to-r from-emerald-400 via-cyan-400 to-accent.cyan"
                            : "bg-gradient-to-r from-red-500 via-rose-500 to-amber-400"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(10, Math.abs(coin.score))
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-100/90 leading-snug line-clamp-2">
                      {reason}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New & Exploding / Daily Focus 그대로 아래 배치 */}
      <NewExploding markets={markets} />
      <DailyFocus markets={markets} />
    </section>
  );
}
