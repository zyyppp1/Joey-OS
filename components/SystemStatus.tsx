"use client";

import { useEffect, useState } from "react";

type Metrics = { total_requests: number; threats_blocked: number };

const AWS_API_URL = process.env.NEXT_PUBLIC_AWS_API_URL || "";

/**
 * "This site is alive" — pulls REAL metrics from the running Lambda (get_metrics)
 * to prove the portfolio is a live system, not a static page.
 */
export function SystemStatus() {
  const [m, setM] = useState<Metrics | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!AWS_API_URL) return;
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(AWS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_metrics" }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!active) return;
        setM({
          total_requests: data.total_requests ?? 0,
          threats_blocked: data.threats_blocked ?? 0,
        });
        setLive(true);
      } catch {
        /* offline / not configured — render the idle state */
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const fmt = (n: number | undefined) =>
    typeof n === "number" ? n.toLocaleString() : "—";

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 font-mono text-sm">
      <div className="flex items-center justify-between">
        <span className="uppercase tracking-widest text-muted">System status</span>
        <span className="flex items-center gap-2 text-xs">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              live ? "animate-pulse bg-terminal" : "bg-muted"
            }`}
          />
          {live ? "online" : "idle"}
        </span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <div className="text-3xl font-semibold text-fg">{fmt(m?.total_requests)}</div>
          <div className="mt-1 text-xs text-muted">AI requests served</div>
        </div>
        <div>
          <div className="text-3xl font-semibold text-fg">{fmt(m?.threats_blocked)}</div>
          <div className="mt-1 text-xs text-muted">abuse attempts blocked</div>
        </div>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-muted">
        <span className="text-terminal">$</span> live from DynamoDB + Redis via the
        Joey&nbsp;OS Lambda — this page is a running system.
      </p>
    </div>
  );
}
