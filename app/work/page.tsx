import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/fx/Reveal";
import { SpotlightCard } from "@/components/fx/SpotlightCard";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects and case studies.",
};

export default function WorkPage() {
  return (
    <main className="py-20 sm:py-28">
      <Container>
        <Link href="/" className="font-mono text-sm text-muted hover:text-fg">
          ← back
        </Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">Work</h1>
        <p className="mt-3 max-w-xl text-muted">
          Things I&apos;ve designed, built, and shipped — each as a short case study.
        </p>
        <div className="mt-12 space-y-5">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Link href={`/work/${p.slug}`} className="block">
                <SpotlightCard className="rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-fg">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-xl font-medium">{p.title}</h2>
                    <span className="shrink-0 font-mono text-xs text-muted">
                      {p.year}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{p.tagline}</p>
                  <p className="mt-3 text-sm leading-relaxed">{p.summary}</p>
                  {p.impact[0] && (
                    <p className="mt-3 font-mono text-xs text-terminal">↳ {p.impact[0]}</p>
                  )}
                  <span className="mt-4 inline-block font-mono text-xs text-accent">
                    Read case study →
                  </span>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </main>
  );
}
