import { sanityConfigured, client } from "@/lib/sanity/client";
import { BLOG_POSTS } from "@/data/blogs";
import type { Post } from "./types";

function toExcerpt(content: string): string {
  const flat = content.replace(/\s+/g, " ").trim();
  return flat.length > 160 ? flat.slice(0, 160).trimEnd() + "…" : flat;
}

// ===================== CONTENT SOURCE — THE SEAM =====================
// Configured? read from Sanity. Not configured? fall back to local data/blogs.ts
// so the build always passes. Set NEXT_PUBLIC_SANITY_PROJECT_ID to switch on Sanity.
// =====================================================================

function localPosts(): Post[] {
  return [...BLOG_POSTS]
    .map((p) => ({
      slug: p.filename.replace(/\.[^.]+$/, ""),
      title: p.title,
      date: p.date,
      content: p.content,
      excerpt: toExcerpt(p.content),
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function ptToExcerpt(blocks: any): string {
  if (!Array.isArray(blocks)) return "";
  const text = blocks
    .filter((b) => b && b._type === "block")
    .map((b) => (b.children || []).map((c: any) => c.text || "").join(""))
    .join(" ");
  return toExcerpt(text);
}

const POSTS_QUERY = `*[_type == "post" && defined(slug.current)]
  | order(coalesce(publishedAt, _createdAt) desc){
    "slug": slug.current,
    title,
    "date": coalesce(publishedAt, _createdAt),
    excerpt,
    "coverImage": coverImage.asset->url,
    tags,
    body
  }`;

async function sanityPosts(): Promise<Post[]> {
  const rows = await client.fetch<any[]>(POSTS_QUERY, {}, { next: { revalidate: 60 } });
  return (rows || []).map((r) => ({
    slug: r.slug,
    title: r.title,
    date: typeof r.date === "string" ? r.date.slice(0, 10) : "",
    excerpt: r.excerpt || ptToExcerpt(r.body),
    content: "",
    body: Array.isArray(r.body) ? r.body : [],
    coverImage: r.coverImage || undefined,
    tags: Array.isArray(r.tags) ? r.tags : [],
  }));
}

export async function fetchPosts(): Promise<Post[]> {
  return sanityConfigured ? sanityPosts() : localPosts();
}
