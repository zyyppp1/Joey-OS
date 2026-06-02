"use client";

import { useEffect, useState } from "react";

/**
 * One-time opening screen: a dark terminal splash that shows "$ whoami → Joey Zhu"
 * then fades to reveal the site. Plays once per browser session, skips entirely
 * under prefers-reduced-motion, and is click-to-dismiss. Renders null on the
 * server + first client render (no hydration mismatch), then shows on mount.
 */
export function Intro() {
  const [stage, setStage] = useState<"hidden" | "show" | "out">("hidden");

  useEffect(() => {
    if (sessionStorage.getItem("introSeen")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("introSeen", "1");
      return;
    }
    setStage("show");
    document.documentElement.style.overflow = "hidden";
    const tOut = setTimeout(() => setStage("out"), 1500);
    const tEnd = setTimeout(() => {
      setStage("hidden");
      sessionStorage.setItem("introSeen", "1");
      document.documentElement.style.overflow = "";
    }, 2100);
    return () => {
      clearTimeout(tOut);
      clearTimeout(tEnd);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (stage === "hidden") return null;

  const dismiss = () => {
    setStage("hidden");
    sessionStorage.setItem("introSeen", "1");
    document.documentElement.style.overflow = "";
  };

  return (
    <div
      onClick={dismiss}
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-500 ${
        stage === "out" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="text-center font-mono [animation:introUp_0.5s_ease-out]">
        <p className="text-base text-neutral-500">
          <span className="text-[#16a34a]">$</span> whoami
        </p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-50 sm:text-5xl">
          Joey&nbsp;Zhu
          <span className="ml-0.5 animate-pulse text-[#16a34a]">_</span>
        </p>
      </div>
    </div>
  );
}
