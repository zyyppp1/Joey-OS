import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight">
          JZ<span className="text-terminal">_</span>
        </Link>
        <div className="flex items-center gap-5 text-sm text-muted">
          <Link href="/work" className="transition-colors hover:text-fg">
            Work
          </Link>
          <Link href="/about" className="transition-colors hover:text-fg">
            About
          </Link>
          <Link href="/blog" className="transition-colors hover:text-fg">
            Writing
          </Link>
          <Link href="/#contact" className="transition-colors hover:text-fg">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
