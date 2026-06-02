import Link from "next/link";
import { Section } from "../ui/Section";
import { projects, type Project } from "@/data/projects";
import { Reveal } from "../fx/Reveal";
import { SpotlightCard } from "../fx/SpotlightCard";

export function FeaturedWork() {
  // Projects shown directly on the home, in this order (the rest live on /work).
  const HOME_ORDER = ["ai-resume-editor", "joey-os", "zoho-mail-ai"];
  const featured = HOME_ORDER.map((slug) =>
    projects.find((p) => p.slug === slug)
  ).filter((p): p is Project => Boolean(p));
  return (
    <Section id="work" eyebrow="selected work" title="Things I've built">
      <div className="space-y-5">
        {featured.map((p, i) => (
          <Reveal key={p.slug} delay={i * 90}>
            <Link href={`/work/${p.slug}`} className="block">
              <SpotlightCard className="rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-fg">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-medium">{p.title}</h3>
                  <span className="shrink-0 font-mono text-xs text-muted">{p.year}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{p.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed">{p.summary}</p>
                {p.impact[0] && (
                  <p className="mt-3 font-mono text-xs text-terminal">↳ {p.impact[0]}</p>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {p.stack.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-xs text-accent">Read case study →</span>
                </div>
              </SpotlightCard>
            </Link>
          </Reveal>
        ))}
      </div>
      {projects.length > featured.length && (
        <Link
          href="/work"
          className="mt-8 inline-block font-mono text-sm text-accent hover:underline"
        >
          All work →
        </Link>
      )}
    </Section>
  );
}
