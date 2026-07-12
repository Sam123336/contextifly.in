import type { MetadataRoute } from "next";

const SITE_URL = "https://www.contextifly.in";

// Single-page marketing site — the sections (#compare, #versus, …) are anchors
// on `/`, not separate routes, so the sitemap lists the one canonical URL.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
