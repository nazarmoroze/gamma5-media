import type { Metadata } from "next";
import { stegaClean } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SanityImage } from "@/components/SanityImage";
import { CaseVideo } from "@/components/case/CaseVideo";
import { ArrowRightIcon, ChevronLeftIcon } from "@/components/icons";
import { CtaBand } from "@/components/site/CtaBand";
import { JsonLd } from "@/components/site/JsonLd";
import { PageTransition } from "@/components/site/PageTransition";
import { caseCategory, caseHref, categoryLabel, isVertical, type CaseCategory } from "@/components/work/types";
import { siteUrl } from "@/lib/site";
import { absoluteUrl, breadcrumbList, organizationId } from "@/lib/structured-data";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import { sanityFetch } from "@/sanity/live";
import { CASE_QUERY, CASE_SLUGS_QUERY, CASES_QUERY, SETTINGS_QUERY } from "@/sanity/queries";

import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

// How each category reads in titles and descriptions.
const videoKind: Record<CaseCategory, string> = {
  commercial: "commercial video",
  youtube: "YouTube video",
  short: "short-form video",
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const titleCase = (text: string) => text.replace(/(^|[\s-])([a-z])/g, (_, before, letter) => before + letter.toUpperCase());

// Search title and description built from the case fields; an editor-written summary wins for the description.
function caseSeo(item: { title: string | null; client: string | null; category: string | null; summary: string | null }) {
  const category = caseCategory(item.category);
  const kind = (category && videoKind[category]) || "video";
  const forClient = item.client ? ` for ${item.client}` : "";
  return {
    title: `${item.title}: ${titleCase(kind)}${forClient}`,
    description:
      item.summary ??
      `${capitalize(kind)}${forClient}, produced by GAMMA5, a full-cycle video production company in Cyprus. Watch the project and discuss your own video.`,
  };
}

export async function generateStaticParams() {
  const slugs = await client.withConfig({ useCdn: false }).fetch(CASE_SLUGS_QUERY, {}, { perspective: "published" });
  return slugs.filter((slug): slug is string => Boolean(slug)).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: item } = await sanityFetch({ query: CASE_QUERY, params: { slug }, stega: false });
  if (!item) return {};

  const { title, description } = caseSeo(item);
  const image = item.cover?.asset?._id ? urlFor(item.cover.asset._id).width(1200).height(630).url() : undefined;

  return {
    title,
    description,
    alternates: { canonical: caseHref(item.slug) },
    openGraph: {
      type: "article",
      url: caseHref(item.slug),
      title: `${title} | GAMMA5`,
      description,
      locale: "en_US",
      images: image ? [image] : undefined,
    },
    twitter: { card: "summary_large_image", title: `${title} | GAMMA5`, description, images: image ? [image] : undefined },
  };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const [{ data: item }, { data: cases }, { data: settings }] = await Promise.all([
    sanityFetch({ query: CASE_QUERY, params: { slug } }),
    sanityFetch({ query: CASES_QUERY }),
    sanityFetch({ query: SETTINGS_QUERY, stega: false }),
  ]);
  if (!item) notFound();

  const clean = stegaClean(item);
  const url = absoluteUrl(caseHref(clean.slug));
  const videoUrl = clean.fullVideo ?? clean.previewVideo;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // The film is the main content of a case page, which makes it eligible for video results.
      ...(videoUrl && clean.cover?.asset?._id
        ? [
            {
              "@type": "VideoObject",
              "@id": `${url}#video`,
              name: clean.client ? `${clean.title} — ${clean.client}` : clean.title,
              description: caseSeo(clean).description,
              thumbnailUrl: [urlFor(clean.cover.asset._id).width(1280).height(720).url()],
              uploadDate: clean.releaseDate ?? clean._createdAt,
              contentUrl: videoUrl,
              url,
              publisher: {
                "@type": "Organization",
                "@id": organizationId,
                name: settings?.name || "GAMMA5",
                url: siteUrl,
                logo: { "@type": "ImageObject", url: `${siteUrl}/icon-512.png`, width: 512, height: 512 },
              },
            },
          ]
        : []),
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: "Work", path: "/work" },
        { name: clean.title ?? "Case", path: caseHref(clean.slug) },
      ]),
    ],
  };

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
    <PageTransition>
      <main className={styles.page}>
        <JsonLd data={structuredData} />
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
            vertical={isVertical(item.orientation)}
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
    </PageTransition>
  );
}
