import type { MetadataRoute } from "next";
import { seoConfig } from "@/config/seo.config";

/**
 * Generates a dynamic sitemap for Google and other search engines.
 * Includes all public pages in all supported languages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const { baseUrl, publicPages, languages, defaultLanguage } = seoConfig;
  const entries: MetadataRoute.Sitemap = [];

  for (const page of publicPages) {
    for (const lang of languages) {
      const url = `${baseUrl}/${lang}${page}`;
      
      // Build alternates for each language
      const alternates: Record<string, string> = {};
      for (const altLang of languages) {
        alternates[altLang] = `${baseUrl}/${altLang}${page}`;
      }
      // Add x-default pointing to the default language
      alternates["x-default"] = `${baseUrl}/${defaultLanguage}${page}`;

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1 : 0.8,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return entries;
}
