"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const COLS = 14;
const ROWS = 9;

/**
 * "prefer old version?" nav button → a falling-shards transition: a grid of
 * fragments drops in from the top to cover the screen, we route to /joey-os
 * underneath, then the shards keep falling to reveal the old desktop OS.
 * Reduced-motion users skip straight to the route.
 */
export function VersionSwitch() {
  const router = useRouter();
  const [on, setOn] = useState(false);
  const [phase, setPhase] = useState<"in" | "out">("in");

  const tiles = useMemo(() => {
    const arr: { key: string; inDelay: number; outDelay: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        arr.push({
          key: `${r}-${c}`,
          inDelay: r * 0.05 + Math.random() * 0.22,
          outDelay: (ROWS - 1 - r) * 0.045 + Math.random() * 0.18,
        });
      }
    }
    return arr;
  }, []);

  const go = () => {
    if (on) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push("/joey-os");
      return;
    }
    setPhase("in");
    setOn(true);
    router.prefetch("/joey-os");
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => router.push("/joey-os"), 1300);
    setTimeout(() => setPhase("out"), 1900);
    setTimeout(() => {
      setOn(false);
      document.documentElement.style.overflow = "";
    }, 2600);
  };

  return (
    <>
      <button
        onClick={go}
        className="hidden rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-terminal hover:text-terminal sm:inline-flex"
      >
        prefer old version?
      </button>

      {on && (
        <div aria-hidden="true" className="fixed inset-0 z-[300] overflow-hidden">
          <div
            className="grid h-full w-full gap-px"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            }}
          >
            {tiles.map((t) => (
              <div
                key={t.key}
                className={`shard ${phase === "in" ? "shard-in" : "shard-out"}`}
                style={{
                  animationDelay: `${phase === "in" ? t.inDelay : t.outDelay}s`,
                }}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p
              className="font-mono text-xl font-bold tracking-[0.3em] text-[#4ade80] [text-shadow:0_0_12px_rgba(74,222,128,0.6)] sm:text-3xl"
              style={{ animation: "shardLabel 2.4s ease-in-out both" }}
            >
              JOEY_OS v1
            </p>
          </div>
        </div>
      )}
    </>
  );
}
