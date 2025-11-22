"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ctr-notes-v1";

export function NotesCard() {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) setValue(raw);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, value);
  }, [value]);

  return (
    <section className="glass-panel flex flex-col h-full">
      <header className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-slate-100">
          My Notes · Today&apos;s Plan
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Jot down narratives, levels, and execution plans.
        </p>
      </header>
      <div className="px-4 pb-4 flex-1 flex flex-col">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="- Rotate into strong sectors
- Size down on weak trends"
          className="flex-1 w-full resize-none rounded-2xl bg-slate-900/70 border border-slate-700/70 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-accent.cyan/60"
        />
        <div className="mt-2 text-[10px] text-slate-500">
          Auto-saved locally · stays on this device only.
        </div>
      </div>
    </section>
  );
}
