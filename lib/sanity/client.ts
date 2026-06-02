import { createClient } from "next-sanity";

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const SANITY_API_VERSION = "2024-10-01";

// True only once a real Sanity project is wired up. Until then the blog reads
// from local data/blogs.ts (see lib/blog/source.ts) and the build still passes.
export const sanityConfigured = SANITY_PROJECT_ID.length > 0;

export const client = createClient({
  projectId: SANITY_PROJECT_ID || "placeholder",
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
});
