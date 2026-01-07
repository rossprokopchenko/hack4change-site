import { seoConfig } from "@/config/seo.config";

interface EventJsonLdProps {
  language: string;
  description: string;
}

/**
 * Renders JSON-LD structured data for the Hack4Change event.
 * This helps Google display rich results for the event in search.
 */
export default function EventJsonLd({ language, description }: EventJsonLdProps) {
  const { event, baseUrl } = seoConfig;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.location.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: event.location.address.addressLocality,
        addressRegion: event.location.address.addressRegion,
        addressCountry: event.location.address.addressCountry,
      },
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer.name,
      url: event.organizer.url,
    },
    url: `${baseUrl}/${language}`,
    inLanguage: language,
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
