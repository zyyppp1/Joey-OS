"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "./sanity/schemaTypes";
import { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION } from "./lib/sanity/client";

// Embedded Studio config. projectId falls back to a placeholder so the build
// passes before a real Sanity project is connected; set NEXT_PUBLIC_SANITY_PROJECT_ID
// (and optionally NEXT_PUBLIC_SANITY_DATASET) to go live.
export default defineConfig({
  name: "default",
  title: "Joey OS — Blog",
  basePath: "/studio",
  projectId: SANITY_PROJECT_ID || "placeholder",
  dataset: SANITY_DATASET,
  schema,
  plugins: [structureTool(), visionTool({ defaultApiVersion: SANITY_API_VERSION })],
});
