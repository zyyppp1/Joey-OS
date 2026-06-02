// The contract every blog content source must satisfy.
// This is also the target shape for a future CMS schema (e.g. Sanity).
export type Post = {
  slug: string;
  title: string;
  date: string; // ISO-ish; used for sorting + display
  excerpt: string;
  content: string; // plain text today; Portable-Text / MDX-ready later
  tags?: string[]; // reserved
  coverImage?: string; // reserved (CMS image CDN later)
};
