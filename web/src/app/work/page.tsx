import type { Metadata } from "next";

import { CtaBand } from "@/components/site/CtaBand";
import { PageTransition } from "@/components/site/PageTransition";
import { WorkGrid } from "@/components/work/WorkGrid";
import { contactLinks } from "@/lib/site";
import { sanityFetch } from "@/sanity/live";
import { CASES_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Video Production Portfolio",
  description:
    "Commercials, real estate films, YouTube production and short-form videos made by GAMMA5, a video production company in Cyprus.",
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: "/work",
    title: "Video Production Portfolio | GAMMA5",
    description:
      "Commercials, real estate films, YouTube production and short-form videos made by GAMMA5, a video production company in Cyprus.",
  },
};

export default async function WorkPage() {
  const [{ data: cases }, { data: settings }] = await Promise.all([
    sanityFetch({ query: CASES_QUERY }),
    sanityFetch({ query: SETTINGS_QUERY }),
  ]);
  const instagram = contactLinks(settings).find((link) => link.key === "instagram");

  return (
    <PageTransition>
      <main>
        <section className={styles.page} aria-labelledby="work-title">
          <div className="container">
            <WorkGrid
              cases={cases}
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
