"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

type Phase = "in" | "out";

const COLS = 28;
const ROWS = 16;

/**
 * "prefer old version?" → a full-screen black-glass shatter transition: the
 * screen breaks into a dense grid of smoked-glass fragments that fall (with
 * gravity, rotation, drift), we route to /joey-os underneath, then the shards
 * keep falling to reveal the old desktop OS.
 *
 * The overlay is portaled to <body> so it escapes the nav's backdrop-filter
 * containing block and covers the whole viewport. Reduced-motion skips it.
 */
export function VersionSwitch() {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("in");

  const tiles = useMemo(() => {
    const arr = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        arr.push({
          key: `${r}-${c}`,
          inDelay: r * 0.03 + Math.random() * 0.16,
          outDelay: Math.random() * 0.3,
          opacity: 0.7 + Math.random() * 0.3,
          rot: (Math.random() - 0.5) * 100,
          tx: (Math.random() - 0.5) * 140,
        });
      }
    }
    return arr;
  }, []);

  const go = () => {
    if (active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push("/joey-os");
      return;
    }
    setPhase("in");
    setActive(true);
    document.documentElement.style.overflow = "hidden";
    router.prefetch("/joey-os");
    setTimeout(() => router.push("/joey-os"), 850);
    setTimeout(() => setPhase("out"), 1050);
    setTimeout(() => {
      setActive(false);
      document.documentElement.style.overflow = "";
    }, 1850);
  };

  return (
    <>
      <button
        onClick={go}
        className="hidden rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-terminal hover:text-terminal sm:inline-flex"
      >
        prefer old version?
      </button>

      {/* Portal to <body> so the overlay isn't trapped inside the nav's
          backdrop-filter containing block (would otherwise cover only the nav). */}
      {active &&
        typeof document !== "undefined" &&
        createPortal(
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
                  className={`shard shard-glass ${phase === "in" ? "shard-in" : "shard-shatter-out"}`}
                  style={
                    {
                      opacity: t.opacity,
                      animationDelay: `${phase === "in" ? t.inDelay : t.outDelay}s`,
                      "--rot": `${t.rot}deg`,
                      "--tx": `${t.tx}px`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <p
                className="rounded-lg bg-black/70 px-6 py-3 font-mono text-xl font-bold tracking-[0.3em] text-[#4ade80] [text-shadow:0_0_12px_rgba(74,222,128,0.7)] sm:text-3xl"
                style={{ animation: "shardLabel 1.8s ease-in-out both" }}
              >
                JOEY_OS v1
              </p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
