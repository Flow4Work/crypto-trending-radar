"use client";

import { useEffect, useMemo, useState } from "react";
import type { CoinMarket } from "@/utils/trend";
import { computeTrendScore, momentumReason } from "@/utils/trend";

interface Category {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number;
  volume_24h: number;
  heat?: number;
  avgChange?: number;
  volRatio?: number;
  top_3_coins?: string[];  
}

interface Props {
  open: boolean;
  onClose: () => void;
  category: Category;
  markets: CoinMarket[];
}

export function SectorModal({ open, onClose, category, markets }: Props) {
  const [sectorCoins, setSectorCoins] = useState<CoinMarket[]>([]);

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/sector/${category.id}`);
        if (!res.ok) return;
        const data = await res.json();
        setSectorCoins(data);
      } catch {
        // ignore
      }
    };
    load();
  }, [open, category.id]);

  const joinedCoins = useMemo(() => {
    if (sectorCoins.length) return sectorCoins;
    const subset = markets.filter((c) =>
      (category.top_3_coins || []).includes(c.image)
    );
    return subset;
  }, [sectorCoins, markets, category]);

  if (!open) return null;

  const avgChange = category.avgChange ?? category.market_cap_change_24h ?? 0;
  const volRatio = category.volRatio ?? category.volume_24h / (category.market_cap || 1);
  const heat = category.heat ?? 0;

  const basis: string[] = [];
  if (avgChange > 6) basis.push("Sector posting strong green across majors.");
  else if (avgChange > 2)
    basis.push("Moderate positive drift with constructive breadth.");
  else if (avgChange < -6)
    basis.push("Broad heavy selling with little dip-buying so far.");
  else if (avgChange < -2)
    basis.push("Soft red session driven by de-risking.");
  if (volRatio > 0.18)
    basis.push("Volume is expanding aggressively vs. market cap.");
  else if (volRatio > 0.1)
    basis.push("Liquidity is rotating steadily into this theme.");
  else if (volRatio < 0.03)
    basis.push("Flows are muted; theme may be resting.");
  if (!basis.length)
    basis.push("Flows are balanced; no dominant risk-on or risk-off signal.");

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="glass-panel max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-slate-700/80">
        <header className="px-5 pt-4 pb-3 flex items-start justify-between gap-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-semibold text-slate-50">
              {category.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Sector overview · heat score {heat}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-100"
          >
            ✕ Close
          </button>
        </header>
        <div className="px-5 py-3 grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-slate-800/80 text-xs">
          <div>
            <div className="text-slate-400">Market Cap</div>
            <div className="text-slate-50 font-semibold mt-0.5">
              ${(category.market_cap / 1_000_000_0).toFixed(2)}B
            </div>
          </div>
          <div>
            <div className="text-slate-400">24h Change</div>
            <div
              className={
                avgChange >= 0 ? "text-trend.positive mt-0.5" : "text-trend.negative mt-0.5"
              }
            >
              {avgChange.toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-slate-400">Volume / Mcap</div>
            <div className="text-slate-50 mt-0.5">
              {(volRatio * 100).toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-b border-slate-800/80 text-xs">
          <div className="text-slate-400 mb-1.5">Heat Basis</div>
          <p className="text-slate-200 leading-relaxed">
            {basis.join(" ")}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-4 pt-2 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-[11px]">
              Top coins by market cap within this sector.
            </span>
            <span className="badge-pill bg-accent.cyan/10 text-accent.cyan border border-accent.cyan/40 text-[10px]">
              Click a coin to add to your watchlist manually.
            </span>
          </div>
          <table className="w-full border-collapse">
            <thead className="text-[10px] text-slate-400 border-b border-slate-800/80">
              <tr>
                <th className="text-left py-1.5 font-normal">Coin</th>
                <th className="text-right py-1.5 font-normal">Price</th>
                <th className="text-right py-1.5 font-normal">1h</th>
                <th className="text-right py-1.5 font-normal">24h</th>
                <th className="text-right py-1.5 font-normal pr-1">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {joinedCoins.map((coin) => {
                const oneH = coin.price_change_percentage_1h_in_currency ?? 0;
                const day =
                  coin.price_change_percentage_24h_in_currency ?? 0;
                const score = computeTrendScore(coin);
                const reason = momentumReason(coin);

                return (
                  <tr
                    key={coin.id}
                    className="border-b border-slate-800/60 last:border-0 hover:bg-slate-900/60"
                  >
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={coin.image}
                          alt={coin.symbol}
                          className="w-4 h-4 rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="text-[11px]">{coin.name}</span>
                          <span className="text-[9px] uppercase text-slate-500">
                            {coin.symbol}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 text-right text-[11px]">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td className="py-2 text-right text-[11px]">
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
                    <td className="py-2 text-right text-[11px]">
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
                    <td className="py-2 text-right pr-1 text-[11px]">
                      <span className="badge-pill bg-slate-900/90 text-slate-100 border border-slate-700/80 px-2 py-0.5">
                        {score}
                      </span>
                      <div className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">
                        {reason}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {joinedCoins.length === 0 && (
            <div className="text-xs text-slate-500 py-4">
              Loading sector constituents...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
