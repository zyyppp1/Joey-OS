import Link from "next/link";
import { NavLink } from "./NavLink";
import { VersionSwitch } from "./fx/VersionSwitch";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          JZ<span className="text-terminal">_</span>
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <NavLink href="/work" label="Work" match="/work" />
          <NavLink href="/about" label="About" match="/about" />
          <NavLink href="/blog" label="Writing" match="/blog" />
          <NavLink href="/#contact" label="Contact" />
          <Link
            href="/studio"
            className="hidden text-muted transition-colors hover:text-fg sm:inline"
          >
            Admin
          </Link>
          <VersionSwitch />
        </div>
      </nav>
    </header>
  );
}
