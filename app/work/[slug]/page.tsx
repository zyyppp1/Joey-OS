import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { projects, getProject } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: p.tagline };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-terminal">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Bullets({ items, accent = false }: { items: string[]; accent?: boolean }) {
  return (
    <ul className="space-y-2 text-sm leading-relaxed">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className={accent ? "text-terminal" : "text-muted"}>—</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  return (
    <main className="py-20 sm:py-28">
      <Container>
        <Link href="/work" className="font-mono text-sm text-muted hover:text-fg">
          ← all work
        </Link>
        <p className="mt-8 font-mono text-xs uppercase tracking-widest text-terminal">
          {p.year}
          {p.role ? ` · ${p.role}` : ""}
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {p.title}
        </h1>
        <p className="mt-3 text-lg text-muted">{p.tagline}</p>

        {p.links && p.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {p.links.map((l) => {
              const internal = l.href.startsWith("/");
              return (
                <a
                  key={l.href}
                  href={l.href}
                  {...(internal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-fg"
                >
                  {l.label} ↗
                </a>
              );
            })}
          </div>
        )}

        <Block title="Problem">
          <p className="text-sm leading-relaxed text-muted">{p.problem}</p>
        </Block>
        <Block title="Approach">
          <Bullets items={p.approach} />
        </Block>
        {p.architecture && p.architecture.length > 0 && (
          <Block title="Architecture">
            <Bullets items={p.architecture} />
          </Block>
        )}
        <Block title="Impact">
          <Bullets items={p.impact} accent />
        </Block>
        <Block title="Stack">
          <div className="flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted"
              >
                {s}
              </span>
            ))}
          </div>
        </Block>
      </Container>
    </main>
  );
}
