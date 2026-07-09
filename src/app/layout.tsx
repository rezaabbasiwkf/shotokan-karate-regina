import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://shotokan-karate-regina.vercel.app";
const siteName = "Shotokan Karate Regina";
const pageTitle = "Shotokan Karate Regina | Coach Reza Abbasi";
const pageDescription =
  "Traditional Shotokan Karate classes in Regina taught by Coach Reza Abbasi, with a focus on discipline, confidence, respect, fitness, and practical self-defense.";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "MartialArtsSchool",
  name: siteName,
  url: siteUrl,
  description: pageDescription,
  telephone: "306-570-3125",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1751 Broad Street",
    addressLocality: "Regina",
    addressRegion: "SK",
    addressCountry: "CA",
  },
  sameAs: ["https://www.instagram.com/shotokan_karate_yqr"],
  founder: {
    "@type": "Person",
    name: "Reza Abbasi",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: pageTitle,
    template: `%s | ${siteName}`,
  },
  description: pageDescription,
  keywords: [
    "Shotokan Karate Regina",
    "Shotokan Karate classes",
    "Traditional karate training",
    "Coach Reza Abbasi",
    "Karate coach Regina",
    "Karate training Regina",
    "Martial arts Regina",
  ],
  alternates: {
    canonical: "/",
  },
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
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
