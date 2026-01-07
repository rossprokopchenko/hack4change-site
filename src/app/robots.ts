import type { MetadataRoute } from "next";
import { seoConfig } from "@/config/seo.config";

/**
 * Robots.txt configuration for search engine crawlers.
 * - Allows indexing of public pages
 * - Blocks auth/admin pages from being indexed
 */
export default function robots(): MetadataRoute.Robots {
  const { baseUrl, privatePages, languages } = seoConfig;

  // Generate disallow rules for all private pages in all languages
  const disallowRules: string[] = [];
  for (const page of privatePages) {
    for (const lang of languages) {
      disallowRules.push(`/${lang}${page}`);
    }
  }

  // Also disallow API routes
  disallowRules.push("/api/");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: disallowRules,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
