import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { Portfolio } from "@/components/home/Portfolio";
import { JsonLd } from "@/components/site/JsonLd";
import { PageTransition } from "@/components/site/PageTransition";
import { siteUrl } from "@/lib/site";
import { sanityFetch } from "@/sanity/live";
import { HOME_QUERY, SETTINGS_QUERY } from "@/sanity/queries";
import type { HomeData, Settings } from "@/sanity/types";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

function structuredData(home: HomeData | null, settings: Settings | null) {
  const h = stegaClean(home);
  const s = stegaClean(settings);
  const name = s?.name || "GAMMA5";
  const sameAs = [
    s?.instagram ? `https://www.instagram.com/${s.instagram}/` : null,
    s?.linkedin ?? null,
  ].filter(Boolean);
  const faqItems = h?.faq?.items?.filter((item) => item.question && item.answer) ?? [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name,
        alternateName: s?.legalName ?? undefined,
        url: siteUrl,
        logo: `${siteUrl}/logo.svg`,
        description: h?.seo?.description ?? undefined,
        email: s?.email ?? undefined,
        telephone: s?.phone ? s.phone.replace(/[^\d+]/g, "") : undefined,
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
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name,
        inLanguage: "en",
        publisher: { "@id": `${siteUrl}/#organization` },
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
        {home?.about && <About about={home.about} brandName={settings?.name ?? "GAMMA5"} />}
        {home?.portfolio && <Portfolio portfolio={home.portfolio} />}
        {home?.faq?.items?.length ? <Faq faq={home.faq} /> : null}
        {home?.contact && <Contact contact={home.contact} settings={settings} />}
      </main>
    </PageTransition>
  );
}
