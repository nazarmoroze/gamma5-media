import type { Metadata } from "next";

import { CtaBand } from "@/components/site/CtaBand";
import { WorkGrid } from "@/components/work/WorkGrid";
import { sanityFetch } from "@/sanity/fetch";
import { CASES_QUERY } from "@/sanity/queries";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Work — GAMMA5",
  description:
    "Commercials, YouTube production and short-form content made by GAMMA5 for brands, agencies and developers.",
};

export default async function WorkPage() {
  const cases = await sanityFetch({ query: CASES_QUERY });

  return (
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
  );
}
