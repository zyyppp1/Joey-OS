import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Experience } from "@/components/sections/Experience";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "About",
  description: `${profile.summary} Full background, experience, education and skills.`,
};

export default function AboutPage() {
  return (
    <main>
      <section className="pt-16 pb-4 sm:pt-24">
        <Container>
          <Link href="/" className="font-mono text-sm text-muted hover:text-fg">
            ← back
          </Link>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            About
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            {profile.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={profile.resumePdf}
              download
              className="rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              Download résumé ↓
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-border px-5 py-2.5 text-sm transition-colors hover:border-fg"
            >
              LinkedIn ↗
            </a>
          </div>
        </Container>
      </section>
      <Experience />
    </main>
  );
}
