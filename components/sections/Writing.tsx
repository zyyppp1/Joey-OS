import Link from "next/link";
import { Section } from "../ui/Section";
import { getAllPosts } from "@/lib/blog";
import { Reveal } from "../fx/Reveal";

export async function Writing() {
  const posts = (await getAllPosts()).slice(0, 3);
  if (posts.length === 0) return null; // reserved: hide the teaser until there are posts

  return (
    <Section id="writing" eyebrow="blog" title="Writing">
      <ul className="space-y-6">
        {posts.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 70}>
              <Link href={`/blog/${p.slug}`} className="group block">
                <p className="font-mono text-xs text-muted">{p.date}</p>
                <h3 className="mt-1 text-lg font-medium transition-colors group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{p.excerpt}</p>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
      <Link
        href="/blog"
        className="mt-8 inline-block font-mono text-sm text-accent hover:underline"
      >
        All posts →
      </Link>
    </Section>
  );
}
