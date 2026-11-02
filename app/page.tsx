import type { Metadata } from "next";
import { Suspense } from "react";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { sanityFetch, SanityLive } from "@/lib/sanity/live";
import { WEBSITE_QUERY } from "@/lib/sanity/client";
import {
  clean,
  contentWithDefaults,
  email,
  imageUrl,
  safeUrl,
  type WebsiteContent,
} from "@/lib/content";
import { ReplayPage } from "@/components/ReplayPage";
import { SiteEffects } from "@/components/SiteEffects";
import { PreviewControls } from "@/components/PreviewControls";

const origin = "https://replayyork.co.uk";
export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: WEBSITE_QUERY, stega: false });
  const c = contentWithDefaults(data as WebsiteContent | null);
  return {
    metadataBase: new URL(origin),
    title: c.seo.title,
    description: c.seo.description,
    alternates: { canonical: "/" },
    icons: { icon: "/favicon.svg" },
    openGraph: {
      title: c.seo.title,
      description: c.seo.description,
      type: "website",
      url: origin,
      locale: "en_GB",
      siteName: "Replay York",
      images: [
        {
          url: imageUrl(
            c.seo.shareImage,
            `${origin}/assets/replay-brand.jpg`,
            1600,
          ),
          alt: "Replay York",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    ...((await draftMode()).isEnabled
      ? { robots: { index: false, follow: false } }
      : {}),
  };
}
export default async function Page() {
  const { data } = await sanityFetch({ query: WEBSITE_QUERY });
  const c = contentWithDefaults(data as WebsiteContent | null);
  const draft = (await draftMode()).isEnabled;
  const venue = {
    "@type": "NightClub",
    "@id": `${origin}/#venue`,
    name: "Replay York",
    url: origin,
    image: imageUrl(
      c.seo.shareImage,
      `${origin}/assets/replay-brand.jpg`,
      1600,
    ),
    description: clean(c.seo.description),
    address: {
      "@type": "PostalAddress",
      streetAddress: "3 George Hudson Street",
      addressLocality: "York",
      addressRegion: "North Yorkshire",
      postalCode: "YO1 6JL",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 53.9575026,
      longitude: -1.0868521,
    },
    email: email(c),
    sameAs: [safeUrl(c.settings.instagramUrl), safeUrl(c.settings.facebookUrl)],
    openingHoursSpecification: c.visit.openingHours?.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${clean(h.day)}`,
      opens: h.closed ? "00:00" : clean(h.opens),
      closes: h.closed ? "00:00" : clean(h.closes),
    })),
  };
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: "Replay York",
        inLanguage: "en-GB",
      },
      venue,
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replaceAll("<", "\\u003c"),
        }}
      />
      <ReplayPage content={c} />
      <SiteEffects />
      <Suspense>
        <SanityLive />
      </Suspense>
      {draft && (
        <>
          <VisualEditing />
          <PreviewControls />
        </>
      )}
    </>
  );
}
