import { BLOG_POSTS } from "@/data/blogs";
import type { Post } from "./types";

function toExcerpt(content: string): string {
  const flat = content.replace(/\s+/g, " ").trim();
  return flat.length > 160 ? flat.slice(0, 160).trimEnd() + "…" : flat;
}

// ===================== CONTENT SOURCE — THE SEAM =====================
// Today the blog is sourced from the local data/blogs.ts file.
//
// To move the blog to a CMS later (e.g. Sanity), replace ONLY the body
// of fetchPosts() with a client query that returns Post[] — for example:
//
//   const client = createClient({ projectId, dataset, useCdn: true });
//   return client.fetch(`*[_type == "post"] | order(date desc){ ... }`);
//
// Nothing else in the app changes: every consumer depends on ./index and
// ./types, never on this file directly. fetchPosts is already async so a
// remote fetch drops in without touching call sites.
// =====================================================================
export async function fetchPosts(): Promise<Post[]> {
  return BLOG_POSTS.map((p) => ({
    slug: p.filename.replace(/\.[^.]+$/, ""),
    title: p.title,
    date: p.date,
    content: p.content,
    excerpt: toExcerpt(p.content),
  })).sort((a, b) => (a.date < b.date ? 1 : -1));
}
