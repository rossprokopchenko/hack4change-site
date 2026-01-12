import type { MetadataRoute } from "next";
import { seoConfig } from "@/config/seo.config";

/**
 * Robots.txt configuration for search engine crawlers.
 * - Allows indexing of public pages
 * - Blocks auth/admin pages from being indexed
 * URLs no longer contain language prefixes (cookie-based detection).
 */
export default function robots(): MetadataRoute.Robots {
  const { baseUrl, privatePages } = seoConfig;

  // Generate disallow rules for all private pages
  const disallowRules: string[] = privatePages.map(page => page);

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

