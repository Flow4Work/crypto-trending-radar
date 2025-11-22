"use client";

import { useEffect, useMemo, useState } from "react";
import type { CoinMarket } from "@/utils/trend";

interface Props {
  markets: CoinMarket[];
}

const STORAGE_KEY = "ctr-watchlist-v1";

export function Watchlist({ markets }: Props) {
  const [query, setQuery] = useState("");
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setIds(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const watchlistCoins = useMemo(
    () => markets.filter((c) => ids.includes(c.id)),
    [markets, ids]
  );

  const matching = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return markets.slice(0, 30);
    return markets.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [markets, query]);

  const toggleId = (id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <section className="glass-panel flex flex-col h-full">
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100">
            My Watchlist
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track coins you actually care about.
          </p>
        </div>
        <span className="badge-pill bg-accent.cyan/10 text-accent.cyan border border-accent.cyan/30">
          {watchlistCoins.length} coins
        </span>
      </header>

      <div className="px-4 pb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search & add..."
          className="w-full rounded-xl bg-slate-900/70 border border-slate-700/70 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent.cyan/60"
        />
        {query && (
          <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-slate-700/70 bg-slate-900/95 text-xs shadow-lg">
            {matching.slice(0, 20).map((coin) => (
              <button
                key={coin.id}
                onClick={() => {
                  toggleId(coin.id);
                  setQuery("");
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-800/80"
              >
                <span className="flex items-center gap-2">
                  <img
                    src={coin.image}
                    alt={coin.symbol}
                    className="w-4 h-4 rounded-full"
                  />
                  <span>
                    {coin.name}
                    <span className="ml-1 text-[10px] uppercase text-slate-400">
                      {coin.symbol}
                    </span>
                  </span>
                </span>
                <span className="text-[10px] text-slate-400">
                  ${coin.current_price.toLocaleString()}
                </span>
              </button>
            ))}
            {matching.length === 0 && (
              <div className="px-3 py-2 text-[11px] text-slate-500">
                No matches.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {watchlistCoins.length === 0 ? (
          <div className="text-xs text-slate-500 px-2 py-6">
            Search a coin above and click it to add to your watchlist.
          </div>
        ) : (
          <table className="w-full text-[11px]">
            <thead className="text-[10px] text-slate-400">
              <tr className="border-b border-slate-800/80">
                <th className="py-1.5 pl-2 text-left font-normal">Coin</th>
                <th className="py-1.5 text-right font-normal">Price</th>
                <th className="py-1.5 text-right font-normal">1h</th>
                <th className="py-1.5 text-right pr-2 font-normal">24h</th>
              </tr>
            </thead>
            <tbody>
              {watchlistCoins.map((coin) => {
                const oneH = coin.price_change_percentage_1h_in_currency ?? 0;
                const day =
                  coin.price_change_percentage_24h_in_currency ?? 0;

                const badge =
                  oneH > 3 ? (
                    <span className="badge-pill bg-amber-500/20 text-amber-300 border border-amber-500/40 ml-1">
                      🔥
                    </span>
                  ) : oneH < -3 ? (
                    <span className="badge-pill bg-trend.negative/15 text-trend.negative border border-trend.negative/40 ml-1">
                      ⚠
                    </span>
                  ) : null;

                return (
                  <tr
                    key={coin.id}
                    className="border-b border-slate-800/50 last:border-0 hover:bg-slate-900/40"
                  >
                    <td className="py-2 pl-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={coin.image}
                          alt={coin.symbol}
                          className="w-4 h-4 rounded-full"
                        />
                        <div className="flex flex-col">
                          <span className="truncate max-w-[110px]">
                            {coin.name}
                          </span>
                          <span className="text-[10px] uppercase text-slate-500">
                            {coin.symbol}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 text-right text-[11px]">
                      ${coin.current_price.toLocaleString()}
                    </td>
                    <td className="py-2 text-right">
                      <span
                        className={
                          oneH >= 0
                            ? "text-trend.positive"
                            : "text-trend.negative"
                        }
                      >
                        {oneH.toFixed(2)}%
                      </span>
                      {badge}
                    </td>
                    <td className="py-2 pr-2 text-right">
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
