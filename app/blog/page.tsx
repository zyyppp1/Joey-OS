import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on backend, cloud, and building things.",
};

export default function BlogIndex() {
  return (
    <main className="py-24 sm:py-32">
      <Container>
        <Link href="/" className="font-mono text-sm text-muted hover:text-fg">
          ← back
        </Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">Writing</h1>
        <ul className="mt-12 space-y-10">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group block">
                <p className="font-mono text-xs text-muted">{p.date}</p>
                <h2 className="mt-1 text-xl font-medium transition-colors group-hover:text-accent">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
