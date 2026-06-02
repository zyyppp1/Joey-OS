import Link from "next/link";
import { profile } from "@/data/profile";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <p>© {year} {profile.shortName}</p>
          <div className="flex gap-5">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-fg"
            >
              GitHub
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-fg"
            >
              LinkedIn
            </a>
          </div>
        </div>
        <p className="mt-6 font-mono text-xs text-muted">
          <Link href="/joey-os" className="text-terminal transition-colors hover:text-fg">
            $ ./joey-os --v1
          </Link>{" "}
          — the original retro desktop OS, kept playable &amp; built in a different style.
        </p>
      </div>
    </footer>
  );
}
