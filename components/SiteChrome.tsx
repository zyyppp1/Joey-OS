"use client";

import React from "react";
import { usePathname } from "next/navigation";

/**
 * Renders portfolio chrome (nav / footer / floating chat / intro) on the site,
 * but NOT on /studio — so the embedded Sanity Studio gets the full screen.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname && pathname.startsWith("/studio")) return null;
  return <>{children}</>;
}
