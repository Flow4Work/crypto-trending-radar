"use client";

import { useEffect, useState } from "react";

interface Props {
  lastUpdated: number | null;
}

export function RefreshBadge({ lastUpdated }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5_000);
    return () => clearInterval(id);
  }, []);

  if (!lastUpdated) return null;

  const diffSec = Math.round((now - lastUpdated) / 1000);
  const label = diffSec <= 3 ? "Just refreshed" : `${diffSec}s ago`;

  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span>Auto refresh · {label}</span>
    </div>
  );
}
