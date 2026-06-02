"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * "prefer old version?" nav button → plays a retro CRT boot animation, then
 * routes to /joey-os (the revived original desktop OS). Reduced-motion users
 * skip straight to the route.
 */
export function VersionSwitch() {
  const router = useRouter();
  const [on, setOn] = useState(false);
  const [fading, setFading] = useState(false);

  const go = () => {
    if (on) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push("/joey-os");
      return;
    }
    setOn(true);
    setFading(false);
    router.prefetch("/joey-os");
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => router.push("/joey-os"), 1400);
    setTimeout(() => setFading(true), 1950);
    setTimeout(() => {
      setOn(false);
      setFading(false);
      document.documentElement.style.overflow = "";
    }, 2450);
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
        <div
          aria-hidden="true"
          className={`fixed inset-0 z-[300] overflow-hidden bg-black transition-opacity duration-500 ${
            fading ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="scanlines pointer-events-none absolute inset-0 z-10" />
          <div className="crt-boot crt-flicker absolute inset-0 flex items-center justify-center">
            <div className="text-center font-mono text-[#4ade80] [text-shadow:0_0_10px_rgba(74,222,128,0.6)]">
              <p className="text-xs opacity-70 sm:text-sm">&gt; exiting portfolio…</p>
              <p className="mt-3 text-xl font-bold tracking-[0.3em] sm:text-3xl">
                BOOTING JOEY_OS v1.0
              </p>
              <div className="mx-auto mt-5 h-2 w-56 max-w-[70vw] overflow-hidden border border-[#4ade80]/60">
                <div className="loadbar h-full bg-[#4ade80]" />
              </div>
              <p className="mt-3 text-xs opacity-60">
                restoring retro desktop<span className="animate-pulse">_</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
