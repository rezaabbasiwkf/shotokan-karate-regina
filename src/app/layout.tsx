import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const siteUrl = SITE_URL;
const siteName = SITE_NAME;
const pageTitle = "Karate Classes in Regina | Shotokan Karate Regina";
const pageDescription =
  "Shotokan karate classes for kids, teens and adults in Regina. View class times, tuition and training with Coach Reza Abbasi at 1751 Broad Street.";

const structuredData = {
  "@context": "https://schema.org",
  "@type": ["SportsActivityLocation", "EducationalOrganization"],
  "@id": `${siteUrl}/#academy`,
  name: siteName,
  url: siteUrl,
  description: pageDescription,
  telephone: "+13065703125",
  email: "shotokan.karate.regina@gmail.com",
  logo: `${siteUrl}/images/logo.PNG`,
  image: [`${siteUrl}/images/class.jpg`],
  areaServed: { "@type": "City", name: "Regina" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "1751 Broad Street",
    addressLocality: "Regina",
    addressRegion: "SK",
    addressCountry: "CA",
  },
  sameAs: ["https://www.instagram.com/shotokan_karate_yqr"],
  employee: {
    "@type": "Person",
    name: "Reza Abbasi",
    jobTitle: "Head Instructor",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Registration and coordination",
    telephone: "+13065195711",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  title: {
    default: pageTitle,
    template: `%s | ${siteName}`,
  },
  description: pageDescription,
  keywords: [
    "Shotokan Karate Regina",
    "Shotokan Karate classes",
    "Professional karate training",
    "Olympic-style Karate Regina",
    "Kata training Regina",
    "Kumite training Regina",
    "Karate competition training",
    "Coach Reza Abbasi",
    "Karate coach Regina",
    "Karate training Regina",
    "Martial arts Regina",
  ],
  icons: {
    icon: [
      {
        url: "/favicon-round.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/favicon-round.png",
        type: "image/png",
      },
    ],
  },
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
    title: pageTitle,
    description: pageDescription,
    url: siteUrl,
    siteName,
    images: [
      {
        url: "/images/class.jpg",
        width: 1200,
        height: 900,
        alt: "Shotokan Karate students training in class in Regina",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/images/class.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [structuredData, {
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              url: siteUrl,
              name: siteName,
              inLanguage: "en-CA",
              publisher: { "@id": `${siteUrl}/#academy` },
            }],
          }).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
