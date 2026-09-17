import type { Metadata } from "next";

import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { Portfolio } from "@/components/home/Portfolio";
import { JsonLd } from "@/components/site/JsonLd";
import { PageTransition } from "@/components/site/PageTransition";
import { contacts, faq, services, site } from "@/content/home";
import { sanityFetch } from "@/sanity/fetch";
import { CASES_QUERY } from "@/sanity/queries";

import { openGraphDefaults } from "./shared-metadata";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    ...openGraphDefaults,
    type: "website",
    url: "/",
    title: `${site.title} | ${site.name}`,
    description: site.description,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      alternateName: "GAMMA5 Media",
      url: site.url,
      logo: `${site.url}/logo.svg`,
      description: site.description,
      email: contacts.email,
      telephone: "+35796167457",
      areaServed: [{ "@type": "Country", name: "Cyprus" }],
      knowsAbout: [...services],
      sameAs: [contacts.instagram.href, contacts.linkedin.href],
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: "en",
      publisher: { "@id": `${site.url}/#organization` },
    },
  ],
};

export default async function Home() {
  const cases = await sanityFetch({ query: CASES_QUERY });
  const featured = cases.filter((item) => item.featured);

  return (
    <PageTransition>
      <main>
        <JsonLd data={organizationJsonLd} />
        <Hero />
        <About />
        <Portfolio cases={featured.length > 0 ? featured : cases} />
        <Faq />
        <Contact />
      </main>
    </PageTransition>
  );
}
