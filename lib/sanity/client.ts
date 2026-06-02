import { createClient } from "next-sanity";

// projectId is a PUBLIC identifier (it ships in the client bundle), so it's safe
// to commit. Overridable via env; defaults to the live project.
export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "dxn80rhm";
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const SANITY_API_VERSION = "2024-10-01";

export const sanityConfigured = SANITY_PROJECT_ID.length > 0;

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: true,
});
