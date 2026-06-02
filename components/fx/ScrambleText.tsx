"use client";

import React, { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/<>_$";

/**
 * "Decode" scramble-in animation. SSR renders the REAL text (good for SEO and
 * no-JS), then on mount it briefly scrambles and settles. aria-label keeps the
 * real text available to screen readers.
 */
export function ScrambleText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let raf = 0;
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const revealCount = Math.floor(p * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          out += " ";
        } else if (i < revealCount) {
          out += text[i];
        } else {
          out += CHARS[(frame * 7 + i * 13) % CHARS.length];
        }
      }
      setDisplay(out);
      frame++;
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
