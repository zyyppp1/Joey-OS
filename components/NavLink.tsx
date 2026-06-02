"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  label,
  match,
}: {
  href: string;
  label: string;
  match?: string; // route prefix that counts as "active"; omit to never highlight
}) {
  const pathname = usePathname();
  const active = match ? pathname === match || pathname.startsWith(match + "/") || pathname === match : false;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`transition-colors ${active ? "text-fg" : "text-muted hover:text-fg"}`}
    >
      {label}
    </Link>
  );
}
