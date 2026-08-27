import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dinely.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/onboarding/",
          "/cart/",
          "/checkout/",
          "/orders/",
          "/profile/",
          "/favourites/",
          "/home/",
          "/explore/",
          "/offers/",
          "/restaurants/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
