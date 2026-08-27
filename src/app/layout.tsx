import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dinely.vercel.app";
const SITE_NAME = "Dinely";
const DEFAULT_DESCRIPTION =
  "Dinely is the all-in-one platform for restaurant management and food ordering. Discover restaurants, manage menus, track orders, and grow your business.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Restaurant Management & Food Ordering Platform`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "restaurant management",
    "food ordering",
    "restaurant platform",
    "menu management",
    "order tracking",
    "table bookings",
    "restaurant analytics",
    "food delivery",
    "restaurant POS",
    "restaurant software",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Restaurant Management & Food Ordering Platform`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Restaurant Management Platform`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Restaurant Management & Food Ordering Platform`,
    description: DEFAULT_DESCRIPTION,
    images: ["/og-image.png"],
    creator: "@dinely",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  verification: {
    // Add your Google Search Console verification token here
    // google: "your-google-verification-token",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

// Inline script to apply theme before React hydrates (prevents flash)
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('dinely-theme');
    var d = t === 'dark' || (t !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(d ? 'dark' : 'light');
  } catch(e) {}
})()
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-white text-neutral-900 dark:bg-[#0a0a0a] dark:text-neutral-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
