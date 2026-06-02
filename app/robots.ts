import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

export default function robots(): MetadataRoute.Robots {
  const base = profile.siteUrl.replace(/\/$/, "");
  return {
    // /joey-os is a JS-only interactive exhibit with no SEO value — keep crawlers out.
    rules: { userAgent: "*", allow: "/", disallow: ["/joey-os", "/studio"] },
    sitemap: `${base}/sitemap.xml`,
  };
}
