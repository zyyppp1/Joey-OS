// The contract every blog content source must satisfy (local data OR Sanity).
export type Post = {
  slug: string;
  title: string;
  date: string; // ISO-ish; used for sorting + display
  excerpt: string;
  content: string; // plain text (local source); "" when the body is Portable Text (Sanity)
  body?: unknown[]; // Sanity Portable Text blocks (rendered by components/PortableBody)
  tags?: string[];
  coverImage?: string; // resolved image URL (Sanity CDN)
};
