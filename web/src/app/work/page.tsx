import type { Metadata } from "next";

import { CtaBand } from "@/components/site/CtaBand";
import { PageTransition } from "@/components/site/PageTransition";
import { WorkGrid } from "@/components/work/WorkGrid";
import { sanityFetch } from "@/sanity/fetch";
import { CASES_QUERY } from "@/sanity/queries";

import { openGraphDefaults } from "../shared-metadata";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Video Production Portfolio",
  description:
    "Commercials, real estate films, YouTube production and short-form videos made by GAMMA5, a video production company in Cyprus.",
  alternates: { canonical: "/work" },
  openGraph: {
    ...openGraphDefaults,
    type: "website",
    url: "/work",
    title: "Video Production Portfolio | GAMMA5",
    description:
      "Commercials, real estate films, YouTube production and short-form videos made by GAMMA5, a video production company in Cyprus.",
  },
};

export default async function WorkPage() {
  const cases = await sanityFetch({ query: CASES_QUERY });

  return (
    <PageTransition>
      <main>
        <section className={styles.page} aria-labelledby="work-title">
          <div className="container">
            <WorkGrid
              cases={cases}
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
