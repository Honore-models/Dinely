interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization schema for the whole site
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dinely",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://dinely.vercel.app",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://dinely.vercel.app"}/favicon.svg`,
    description:
      "Dinely is the all-in-one platform for restaurant management and food ordering.",
    sameAs: [
      "https://x.com/NIYOGUSHIMWAHo1",
      "https://www.linkedin.com/in/niyogushimwa-honore-8427b339a/",
      "https://www.instagram.com/honor_e25/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+250-788-123-456",
      contactType: "customer service",
      email: "support@dinely.com",
      availableLanguage: ["English"],
    },
  };

  return <JsonLd data={data} />;
}

// Website search action schema
export function WebsiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dinely.vercel.app";
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dinely",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/explore?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

// SoftwareApplication schema (for the SaaS product)
export function SoftwareAppJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dinely.vercel.app";
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Dinely",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Restaurant management and food ordering platform. Manage menus, orders, bookings, staff, and analytics.",
    url: baseUrl,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "7",
      highPrice: "20",
      priceCurrency: "USD",
      offerCount: 3,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
  };

  return <JsonLd data={data} />;
}

// FAQ page structured data
export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

// Breadcrumb structured data
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dinely.vercel.app";
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };

  return <JsonLd data={data} />;
}
