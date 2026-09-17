import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { Portfolio } from "@/components/home/Portfolio";
import { TrustedBy } from "@/components/home/TrustedBy";
import { JsonLd } from "@/components/site/JsonLd";
import { PageTransition } from "@/components/site/PageTransition";
import { pageMetadata } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";
import { organizationId, websiteId } from "@/lib/structured-data";
import { sanityFetch } from "@/sanity/live";
import { HOME_QUERY, SETTINGS_QUERY } from "@/sanity/queries";
import type { HomeData, Settings } from "@/sanity/types";

export async function generateMetadata(): Promise<Metadata> {
  const { data: home } = await sanityFetch({ query: HOME_QUERY, stega: false });
  return pageMetadata({
    title: home?.seo?.title || "Video Production Company in Cyprus",
    description: home?.seo?.description,
    path: "/",
    image: home?.seo?.image,
  });
}

function structuredData(home: HomeData | null, settings: Settings | null) {
  const h = stegaClean(home);
  const s = stegaClean(settings);
  const name = s?.name || "GAMMA5";
  const sameAs = [
    s?.instagram ? `https://www.instagram.com/${s.instagram}/` : null,
    s?.linkedin ?? null,
    ...(s?.profiles ?? []),
  ].filter(Boolean);
  const telephone = s?.phone ? s.phone.replace(/[^\d+]/g, "") : undefined;
  const address = s?.address;
  const faqItems = h?.faq?.items?.filter((item) => item.question && item.answer) ?? [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name,
        alternateName: s?.legalName ?? undefined,
        legalName: s?.registeredName ?? undefined,
        url: siteUrl,
        logo: { "@type": "ImageObject", url: `${siteUrl}/icon-512.png`, width: 512, height: 512 },
        description: h?.seo?.description ?? undefined,
        email: s?.email ?? undefined,
        telephone,
        foundingDate: s?.foundingYear ? String(s.foundingYear) : undefined,
        address: {
          "@type": "PostalAddress",
          addressCountry: "CY",
          addressLocality: address?.city ?? undefined,
          streetAddress: address?.street ?? undefined,
          postalCode: address?.postalCode ?? undefined,
        },
        contactPoint:
          s?.email || telephone
            ? [{ "@type": "ContactPoint", contactType: "sales", email: s?.email ?? undefined, telephone }]
            : undefined,
        areaServed: [{ "@type": "Country", name: "Cyprus" }],
        sameAs: sameAs.length ? sameAs : undefined,
      },
      ...(faqItems.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${siteUrl}/#faq`,
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ]
        : []),
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name,
        inLanguage: "en",
        publisher: { "@id": organizationId },
      },
    ],
  };
}

export default async function Home() {
  const [{ data: home }, { data: settings }] = await Promise.all([
    sanityFetch({ query: HOME_QUERY }),
    sanityFetch({ query: SETTINGS_QUERY }),
  ]);

  return (
    <PageTransition>
      <main>
        <JsonLd data={structuredData(home, settings)} />
        {home?.hero && <Hero hero={home.hero} />}
        {home?.about?.clients?.length ? <TrustedBy clients={home.about.clients} /> : null}
        {home?.about && <About about={home.about} brandName={settings?.name ?? "GAMMA5"} />}
        {home?.portfolio && <Portfolio portfolio={home.portfolio} />}
        {home?.faq?.items?.length ? <Faq faq={home.faq} /> : null}
        {home?.contact && <Contact contact={home.contact} settings={settings} />}
      </main>
    </PageTransition>
  );
}
