import type { Metadata } from "next";

export const SITE_URL = "https://www.karateyqr.com";
export const SITE_NAME = "Shotokan Karate Regina";

export function publicPageMetadata({
  title,
  description,
  path,
  image = "/images/class.jpg",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const socialTitle = `${title} | ${SITE_NAME}`;
  return {
    title: path === "/" ? { absolute: socialTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_CA",
      type: "website",
      images: [{ url: image, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}
