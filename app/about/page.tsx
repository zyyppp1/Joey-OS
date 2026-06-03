import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { profile } from "@/data/profile";
import { experience, skills } from "@/data/resume";

export const metadata: Metadata = {
  title: "About",
  description: profile.summary,
};

export default function AboutPage() {
  return (
    <main className="py-16 sm:py-24">
      <Container>
        <Link href="/" className="font-mono text-sm text-muted hover:text-fg">
          ← back
        </Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          About
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/90">
          {profile.bio}
        </p>

        {/* Brief experience — a portfolio, not a CV. Full detail lives in the PDF. */}
        <div className="mt-12">
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-terminal">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((job) => (
              <div
                key={job.company}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
              >
                <div>
                  <span className="text-sm font-medium">
                    {job.role} · {job.company}
                  </span>
                  {job.summary && (
                    <span className="ml-2 text-sm text-muted">— {job.summary}</span>
                  )}
                </div>
                <span className="font-mono text-sm text-muted">{job.period}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tools, as a single line — no skills wall. */}
        <div className="mt-10">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-terminal">
            Tools I reach for
          </h2>
          <p className="text-sm leading-relaxed text-muted">{skills.join(" · ")}</p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href={profile.resumePdf}
            download
            className="rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Full resume (PDF) ↓
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
    </main>
  );
}
