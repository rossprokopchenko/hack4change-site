/**
 * Centralized SEO configuration for the Hack4Change site
 */

export const seoConfig = {
  baseUrl: "https://hack4change.ca",
  siteName: "Hack4Change 2026",
  
  // Event details for structured data
  event: {
    name: "Hack4Change 2026",
    startDate: "2026-03-13",
    endDate: "2026-03-15",
    location: {
      name: "Venn Innovation",
      address: {
        streetAddress: "",
        addressLocality: "Moncton",
        addressRegion: "NB",
        postalCode: "",
        addressCountry: "CA",
      },
    },
    organizer: {
      name: "Civic Tech Moncton",
      url: "https://civictechmoncton.ca",
    },
  },

  // Social/OG image - should be at least 1200x630 for best results
  defaultOgImage: "/Logos/social-preview.png",
  
  // Supported languages
  languages: ["en", "fr"] as const,
  defaultLanguage: "en",

  // Public pages to include in sitemap (paths without language prefix)
  publicPages: [
    "",           // home
    "/about",
    "/faq",
    "/sponsors",
    "/contact",
    "/code-of-conduct",
    "/privacy-policy",
  ],

  // Pages to exclude from search engines
  privatePages: [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/password-change",
    "/confirm-email",
    "/confirm-new-email",
    "/profile",
    "/admin-panel",
  ],
} as const;

export type SupportedLanguage = (typeof seoConfig.languages)[number];
