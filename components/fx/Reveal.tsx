"use client";

import React, { useEffect, useRef } from "react";

/**
 * Scroll-reveal wrapper. Progressive-enhancement: content is visible by default;
 * the `.js .reveal` CSS only hides it once JS is on (see globals.css), so no-JS
 * and crawlers still see everything. Reduced-motion users skip the animation.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ ["--reveal-delay" as string]: `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
