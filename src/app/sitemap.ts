import type { MetadataRoute } from "next";
import { seoConfig } from "@/config/seo.config";

/**
 * Generates a dynamic sitemap for Google and other search engines.
 * Since we now use cookie-based language detection, URLs no longer contain language prefixes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const { baseUrl, publicPages } = seoConfig;
  const entries: MetadataRoute.Sitemap = [];

  for (const page of publicPages) {
    const url = page === "" ? baseUrl : `${baseUrl}${page}`;
    
    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: page === "" ? "weekly" : "monthly",
      priority: page === "" ? 1 : 0.8,
    });
  }

  return entries;
}

