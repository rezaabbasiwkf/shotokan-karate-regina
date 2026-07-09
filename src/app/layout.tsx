import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shotokan-karate-regina.vercel.app"),
  title: "Shotokan Karate Regina | Coach Reza Abbasi",
  description:
    "Professional Shotokan Karate and self-defense classes in Regina with Coach Reza Abbasi for kids, teens, and adults.",
  openGraph: {
    title: "Shotokan Karate Regina | Coach Reza Abbasi",
    description:
      "Traditional Shotokan Karate training in Regina focused on discipline, confidence, fitness, and practical self-defense.",
    url: "https://shotokan-karate-regina.vercel.app",
    siteName: "Shotokan Karate Regina",
    images: [
      {
        url: "/images/class.jpg",
        width: 1200,
        height: 900,
        alt: "Shotokan Karate Regina class training",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
