import type { Metadata } from "next";
import { stegaClean } from "next-sanity";

import { CtaBand } from "@/components/site/CtaBand";
import { JsonLd } from "@/components/site/JsonLd";
import { PageTransition } from "@/components/site/PageTransition";
import { WorkGrid } from "@/components/work/WorkGrid";
import { caseHref } from "@/components/work/types";
import { pageMetadata } from "@/lib/metadata";
import { contactLinks, siteUrl } from "@/lib/site";
import { absoluteUrl, breadcrumbList, websiteId } from "@/lib/structured-data";
import { sanityFetch } from "@/sanity/live";
import { CASES_QUERY, SETTINGS_QUERY, WORK_PAGE_QUERY } from "@/sanity/queries";

import styles from "./page.module.css";

// Used until the Work page document in Sanity has its own SEO fields.
const FALLBACK_TITLE = "Video Production Portfolio";
const FALLBACK_DESCRIPTION =
  "Commercials, real estate films, YouTube production and short-form videos made by GAMMA5, a video production company in Cyprus.";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: WORK_PAGE_QUERY, stega: false });
  return pageMetadata({
    title: data?.seo?.title || FALLBACK_TITLE,
    description: data?.seo?.description || FALLBACK_DESCRIPTION,
    path: "/work",
    image: data?.seo?.image,
  });
}

export default async function WorkPage() {
  const [{ data: cases }, { data: settings }, { data: page }] = await Promise.all([
    sanityFetch({ query: CASES_QUERY }),
    sanityFetch({ query: SETTINGS_QUERY }),
    sanityFetch({ query: WORK_PAGE_QUERY, stega: false }),
  ]);
  const instagram = contactLinks(settings).find((link) => link.key === "instagram");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/work#page`,
        url: absoluteUrl("/work"),
        name: page?.seo?.title || FALLBACK_TITLE,
        description: page?.seo?.description || FALLBACK_DESCRIPTION,
        isPartOf: { "@id": websiteId },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: cases
            .filter((item) => item.slug)
            .map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: absoluteUrl(caseHref(item.slug)),
              name: stegaClean(item.title) ?? undefined,
            })),
        },
      },
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Work", path: "/work" },
      ]),
    ],
  };

  return (
    <PageTransition>
      <main>
        <JsonLd data={structuredData} />
        <section className={styles.page} aria-labelledby="work-title">
          <div className="container">
            <WorkGrid
              cases={cases}
              priorityCount={3}
              extraTile={
                instagram && {
                  href: instagram.href,
                  kicker: "Instagram",
                  title: "More of our work on Instagram.",
                  label: `Follow @${instagram.value}`,
                  external: true,
                }
              }
              heading={
                <>
                  <span className="eyebrow">Work</span>
                  <h1 id="work-title" className={styles.title}>
                    Projects we’ve made
                  </h1>
                  <p className={styles.intro}>
                    Commercials, YouTube production and short-form content for brands, agencies and developers.
                  </p>
                </>
              }
            />
          </div>
        </section>
        <CtaBand title="Have a project in mind?" />
      </main>
    </PageTransition>
  );
}
