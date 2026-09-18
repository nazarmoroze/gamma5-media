"use client";

import { stegaClean } from "next-sanity";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { VideoDialog } from "@/components/VideoDialog";
import { ArrowRightIcon } from "@/components/icons";
import { youtubeId } from "@/lib/youtube";
import { urlFor } from "@/sanity/image";

import { WorkCard } from "./WorkCard";
import styles from "./WorkGrid.module.css";
import { videoAspect } from "./aspect";
import { caseCategory, caseHref, categoryLabel, categoryLabels, isVertical, type CaseCategory, type CaseSummary } from "./types";

type Filter = "all" | CaseCategory;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "commercial", label: categoryLabels.commercial },
  { id: "youtube", label: categoryLabels.youtube },
  { id: "short", label: categoryLabels.short },
];

const pad = (n: number) => String(n).padStart(2, "0");

type Tile = { href: string; kicker: string; title: string; label: string; external?: boolean };

type WorkGridProps = {
  cases: CaseSummary[];
  heading: ReactNode;
  /** Second square tile, used when the red "your project" tile alone can't complete the last row. */
  extraTile?: Tile;
  /** Link under the grid. Hidden on desktop while the extra tile already points to the same place. */
  moreLink?: { href: string; label: string };
  /** Load the first posters eagerly when the grid is on the first screen (the /work page). */
  priorityCount?: number;
};

export function WorkGrid({ cases, heading, extraTile, moreLink, priorityCount = 0 }: WorkGridProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [indicator, setIndicator] = useState({ x: 0, w: 0 });
  const buttons = useRef<Partial<Record<Filter, HTMLButtonElement | null>>>({});

  const list = filter === "all" ? cases : cases.filter((item) => caseCategory(item.category) === filter);
  // Every tile is square, so on the 3-column desktop grid the last row is completed
  // with the red "your project" tile and, when two cells are missing, the extra tile.
  const missing = list.length === 0 ? 0 : (3 - (list.length % 3)) % 3;
  const showCta = missing > 0;
  const showExtra = missing === 2 && Boolean(extraTile);

  useLayoutEffect(() => {
    const measure = () => {
      const el = buttons.current[filter];
      if (el) setIndicator({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [filter]);

  const activeIndex = list.findIndex((item) => item._id === activeId);
  const active = activeIndex >= 0 ? list[activeIndex] : null;
  const step = (delta: number) => {
    if (activeIndex < 0) return;
    setActiveId(list[(activeIndex + delta + list.length) % list.length]._id);
  };

  const activeYoutube = youtubeId(stegaClean(active?.youtubeUrl));
  const activeSrc = stegaClean(active?.fullVideo ?? active?.previewVideo) ?? undefined;
  const activePoster = active?.cover?.asset?._id ? urlFor(active.cover.asset._id).width(1600).url() : "/media/house.jpg";

  return (
    <>
      <div className={styles.head}>
        <div className={styles.titles}>{heading}</div>

        <div className={styles.filtersScroll}>
          <div role="group" aria-label="Filter projects" className={styles.filters}>
            <span
              aria-hidden="true"
              className={styles.indicator}
              style={{ width: indicator.w, transform: `translate3d(${indicator.x}px,0,0)` }}
            />
            {filters.map((f) => {
              const count = f.id === "all" ? cases.length : cases.filter((item) => caseCategory(item.category) === f.id).length;
              // An empty category ("YouTube 0") only tells visitors there is nothing to see.
              if (count === 0 && f.id !== "all") return null;
              return (
                <button
                  key={f.id}
                  ref={(el) => {
                    buttons.current[f.id] = el;
                  }}
                  type="button"
                  className={styles.filter}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label}
                  <span className={styles.count}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.grid} aria-live="polite">
        {list.map((item, i) => (
          <WorkCard
            key={item._id}
            item={item}
            delay={i * 50}
            priority={i < priorityCount}
            onPlay={() => setActiveId(item._id)}
          />
        ))}

        {list.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyTitle}>{categoryLabel(filter)} projects are on the way</span>
            <span className={styles.emptyText}>
              We’re preparing these cases. Need this kind of video now? Let’s talk about your project.
            </span>
            <Link href="/#contact" className="btn btn-outline">
              Discuss your project
            </Link>
          </div>
        )}

        {showCta && (
          <Link href="/#contact" className={styles.cta} style={{ animationDelay: `${list.length * 50}ms` }}>
            <span className={styles.ctaKicker}>Your project</span>
            <span className={styles.ctaBody}>
              <span className={styles.ctaTitle}>Could be the next one here.</span>
              <span className={styles.ctaLink}>
                Discuss your project <ArrowRightIcon />
              </span>
            </span>
          </Link>
        )}

        {showExtra && extraTile && (
          <Link
            href={extraTile.href}
            className={styles.tile}
            style={{ animationDelay: `${(list.length + 1) * 50}ms` }}
            {...(extraTile.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <span className={styles.ctaKicker}>{extraTile.kicker}</span>
            <span className={styles.ctaBody}>
              <span className={styles.ctaTitle}>{extraTile.title}</span>
              <span className={styles.ctaLink}>
                {extraTile.label} <ArrowRightIcon />
              </span>
            </span>
          </Link>
        )}
      </div>

      {moreLink && (
        <div className={`${styles.more} ${showExtra ? styles.moreMobileOnly : ""}`}>
          <Link href={moreLink.href} className="btn btn-outline">
            {moreLink.label}
            <ArrowRightIcon />
          </Link>
        </div>
      )}

      <VideoDialog
        open={active !== null}
        onClose={() => setActiveId(null)}
        title={active?.title ?? ""}
        meta={active ? [active.client, categoryLabel(active.category)].filter(Boolean).join(" · ") : undefined}
        src={activeSrc}
        youtube={activeYoutube}
        previewNote={
          active && !active.fullVideo && !activeYoutube && active.previewVideo ? "Preview · full film coming soon" : undefined
        }
        poster={activePoster}
        posterAlt={active?.cover?.alt ?? ""}
        vertical={isVertical(active?.orientation ?? null)}
        aspect={active ? videoAspect(active.videoAspect, isVertical(active.orientation)) : undefined}
        action={active ? { href: caseHref(active.slug), label: "View case study" } : undefined}
        counter={active ? `${pad(activeIndex + 1)} / ${pad(list.length)}` : undefined}
        onPrev={list.length > 1 ? () => step(-1) : undefined}
        onNext={list.length > 1 ? () => step(1) : undefined}
      />
    </>
  );
}
