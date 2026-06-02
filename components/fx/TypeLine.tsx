"use client";

import React, { useEffect, useState } from "react";

/**
 * Typewriter line with a blinking cursor. Real text is in an sr-only span for
 * SEO/screen-readers; the visible part types out on mount.
 */
export function TypeLine({
  text,
  className = "",
  speed = 40,
  startDelay = 650,
}: {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      return;
    }
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const startTimer = setTimeout(function step() {
      i++;
      setN(i);
      if (i < text.length) t = setTimeout(step, speed);
    }, startDelay);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(t);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, n)}
        <span className="animate-pulse">_</span>
      </span>
    </span>
  );
}
