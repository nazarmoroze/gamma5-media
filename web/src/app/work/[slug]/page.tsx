import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SanityImage } from "@/components/SanityImage";
import { CaseVideo } from "@/components/case/CaseVideo";
import { ArrowRightIcon, ChevronLeftIcon } from "@/components/icons";
import { CtaBand } from "@/components/site/CtaBand";
import { caseHref, categoryLabel } from "@/components/work/types";
import { client } from "@/sanity/client";
import { sanityFetch } from "@/sanity/fetch";
import { urlFor } from "@/sanity/image";
import { CASE_QUERY, CASE_SLUGS_QUERY, CASES_QUERY } from "@/sanity/queries";

import { openGraphDefaults } from "../../shared-metadata";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await client.withConfig({ useCdn: false }).fetch(CASE_SLUGS_QUERY);
  return slugs.filter((slug): slug is string => Boolean(slug)).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await sanityFetch({ query: CASE_QUERY, params: { slug } });
  if (!item) return {};

  const description =
    item.summary ?? `${categoryLabel(item.category)} video for ${item.client} by GAMMA5, full-cycle video production.`;
  const image = item.cover?.asset?._id ? urlFor(item.cover.asset._id).width(1200).height(630).url() : undefined;

  return {
    title: `${item.title} — ${item.client}`,
    description,
    alternates: { canonical: caseHref(item.slug) },
    openGraph: {
      type: "article",
      url: caseHref(item.slug),
      title: `${item.title} — ${item.client} | GAMMA5`,
      description,
      siteName: openGraphDefaults.siteName,
      locale: openGraphDefaults.locale,
      images: image ? [image] : openGraphDefaults.images,
    },
  };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const [item, cases] = await Promise.all([
    sanityFetch({ query: CASE_QUERY, params: { slug } }),
    sanityFetch({ query: CASES_QUERY }),
  ]);
  if (!item) notFound();

  const index = cases.findIndex((c) => c._id === item._id);
  const next = cases.length > 1 && index >= 0 ? cases[(index + 1) % cases.length] : null;

  const facts = [
    { label: "Client", value: item.client },
    { label: "Category", value: categoryLabel(item.category) },
    { label: "Year", value: item.year ? String(item.year) : null },
    { label: "What we did", value: item.scope?.length ? item.scope.join(", ") : null },
  ].filter((fact) => fact.value);

  const story = [
    { label: "The brief", text: item.brief },
    { label: "The idea", text: item.idea },
    { label: "The result", text: item.result },
  ].filter((part) => part.text);

  const gallery = item.gallery?.filter((image) => image.asset?._id) ?? [];
  const credits = item.credits?.filter((credit) => credit.role && credit.name) ?? [];
  const quote = item.testimonial?.quote ? item.testimonial : null;

  return (
    <main className={styles.page}>
      <div className="container">
        <Link href="/work" className={styles.back}>
          <ChevronLeftIcon size={16} />
          All work
        </Link>

        <header className={styles.intro}>
          <span className="eyebrow">{[categoryLabel(item.category), item.year].filter(Boolean).join(" · ")}</span>
          <h1 className={styles.title}>{item.title}</h1>
          {item.summary && <p className={styles.summary}>{item.summary}</p>}
        </header>

        <CaseVideo
          title={item.title ?? ""}
          cover={item.cover}
          fullVideo={item.fullVideo}
          previewVideo={item.previewVideo}
          vertical={item.orientation === "vertical"}
        />

        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt className={styles.factLabel}>{fact.label}</dt>
              <dd className={styles.factValue}>{fact.value}</dd>
            </div>
          ))}
        </dl>

        {story.length > 0 && (
          <section className={styles.story} aria-label="About the project">
            {story.map((part) => (
              <div key={part.label} className={styles.storyPart}>
                <h2 className={styles.storyLabel}>{part.label}</h2>
                <p className={styles.storyText}>{part.text}</p>
              </div>
            ))}
          </section>
        )}

        {gallery.length > 0 && (
          <section className={styles.gallery} aria-labelledby="stills-title">
            <h2 id="stills-title" className={styles.sectionLabel}>
              Stills
            </h2>
            <div className={styles.galleryGrid}>
              {gallery.map((image, i) => (
                <figure key={image._key} className={`${styles.still} ${i % 3 === 0 ? styles.stillWide : ""}`}>
                  <div className={styles.stillFrame}>
                    <SanityImage
                      image={image}
                      sizes={i % 3 === 0 ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 900px) 600px, 100vw"}
                    />
                  </div>
                  {image.caption && <figcaption className={styles.caption}>{image.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        {(credits.length > 0 || quote) && (
          <section className={styles.people} aria-label="Credits and testimonial">
            {quote && (
              <figure className={styles.quote}>
                <blockquote className={styles.quoteText}>“{quote.quote}”</blockquote>
                {(quote.author || quote.role) && (
                  <figcaption className={styles.quoteAuthor}>
                    {[quote.author, quote.role].filter(Boolean).join(", ")}
                  </figcaption>
                )}
              </figure>
            )}
            {credits.length > 0 && (
              <div className={styles.credits}>
                <h2 className={styles.sectionLabel}>Credits</h2>
                <dl className={styles.creditList}>
                  {credits.map((credit) => (
                    <div key={credit._key} className={styles.credit}>
                      <dt className={styles.creditRole}>{credit.role}</dt>
                      <dd className={styles.creditName}>{credit.name}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </section>
        )}

        {next && (
          <Link href={caseHref(next.slug)} className={styles.next}>
            <div className={styles.nextImage}>
              <SanityImage image={next.cover} sizes="(min-width: 900px) 560px, 100vw" />
            </div>
            <div className={styles.nextText}>
              <span className={styles.nextLabel}>Next case</span>
              <span className={styles.nextTitle}>{next.title}</span>
              <span className={styles.nextMeta}>
                {[next.client, categoryLabel(next.category)].filter(Boolean).join(" · ")}
              </span>
              <span className={styles.nextArrow}>
                <ArrowRightIcon />
              </span>
            </div>
          </Link>
        )}
      </div>

      <CtaBand title="Have a project like this?" />
    </main>
  );
}
