// lib/blog.ts — blog data access layer.
// NOTE: reads from data/blogs.ts for now; this is the seam we swap to Sanity in P2.

import { BLOG_POSTS, BlogPost } from "@/data/blogs";

export type Post = BlogPost & { slug: string; excerpt: string };

function toExcerpt(content: string): string {
  const flat = content.replace(/\s+/g, " ").trim();
  return flat.length > 160 ? flat.slice(0, 160).trimEnd() + "…" : flat;
}

export const posts: Post[] = [...BLOG_POSTS]
  .map((p) => ({
    ...p,
    slug: p.filename.replace(/\.[^.]+$/, ""),
    excerpt: toExcerpt(p.content),
  }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
