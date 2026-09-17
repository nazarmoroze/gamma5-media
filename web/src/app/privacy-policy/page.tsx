import type { Metadata } from "next";
import { PortableText, stegaClean, type PortableTextComponents } from "next-sanity";
import { notFound } from "next/navigation";

import { PageTransition } from "@/components/site/PageTransition";
import { newTab } from "@/lib/site";
import { sanityFetch } from "@/sanity/live";
import { PRIVACY_QUERY } from "@/sanity/queries";

import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await sanityFetch({ query: PRIVACY_QUERY, stega: false });
  if (!data) return {};
  const title = data.title || "Privacy Policy";

  return {
    title,
    description: data.description ?? undefined,
    alternates: { canonical: "/privacy-policy" },
    openGraph: { type: "website", url: "/privacy-policy", title: `${title} | GAMMA5`, description: data.description ?? undefined },
  };
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
    h3: ({ children }) => <h3 className={styles.h3}>{children}</h3>,
    normal: ({ children }) => <p className={styles.p}>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className={styles.list}>{children}</ul>,
    number: ({ children }) => <ol className={styles.list}>{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = stegaClean(value?.href) as string | undefined;
      if (!href) return <>{children}</>;
      const external = /^https?:\/\//.test(href) && !href.startsWith("https://gamma5media.com");
      return (
        <a href={href} className={styles.link} {...(external ? newTab : {})}>
          {children}
        </a>
      );
    },
  },
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function PrivacyPolicyPage() {
  const { data } = await sanityFetch({ query: PRIVACY_QUERY });
  if (!data) notFound();

  const lastUpdated = stegaClean(data.lastUpdated);

  return (
    <PageTransition>
      <main className={styles.page}>
        <article className={`container ${styles.inner}`}>
          <header className={styles.header}>
            <span className="eyebrow">Legal</span>
            <h1 className={styles.title}>{data.title}</h1>
            {lastUpdated && (
              <p className={styles.updated}>
                Last updated <time dateTime={lastUpdated}>{dateFormat.format(new Date(lastUpdated))}</time>
              </p>
            )}
          </header>
          {data.body && (
            <div className={styles.body}>
              <PortableText value={data.body} components={components} />
            </div>
          )}
        </article>
      </main>
    </PageTransition>
  );
}
