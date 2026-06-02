// Public blog API. Consumers import only from here (`@/lib/blog`).
import { fetchPosts } from "./source";
import type { Post } from "./types";

export type { Post };

export async function getAllPosts(): Promise<Post[]> {
  return fetchPosts();
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await fetchPosts();
  return posts.find((p) => p.slug === slug);
}
