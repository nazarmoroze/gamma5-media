"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import { ArrowRightIcon, PlayIcon } from "@/components/icons";
import { categoryLabels, work, type WorkCategory, type WorkItem } from "@/content/home";

import styles from "./Portfolio.module.css";
import { VideoDialog } from "./VideoDialog";

type Filter = "all" | WorkCategory;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "commercial", label: categoryLabels.commercial },
  { id: "youtube", label: categoryLabels.youtube },
  { id: "short", label: categoryLabels.short },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function Portfolio() {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [indicator, setIndicator] = useState({ x: 0, w: 0 });
  const buttons = useRef<Partial<Record<Filter, HTMLButtonElement | null>>>({});

  const list = filter === "all" ? work : work.filter((item) => item.category === filter);
  const featured = filter === "all";
  // On the 3-column desktop grid a red card fills the last row when it is incomplete.
  const cellsUsed = list.length + (featured ? 1 : 0);
  const showCta = cellsUsed % 3 !== 0;

  useLayoutEffect(() => {
    const measure = () => {
      const el = buttons.current[filter];
      if (el) setIndicator({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [filter]);

  const activeIndex = list.findIndex((item) => item.id === activeId);
  const active = activeIndex >= 0 ? list[activeIndex] : null;
  const step = (delta: number) => {
    if (activeIndex < 0) return;
    setActiveId(list[(activeIndex + delta + list.length) % list.length].id);
  };

  return (
    <section id="portfolio" className={styles.portfolio} aria-labelledby="portfolio-title">
      <div className="container">
        <div className={styles.head}>
          <div className={styles.titles}>
            <span className="eyebrow">Portfolio</span>
            <h2 id="portfolio-title" className="section-title">
              Selected work
            </h2>
          </div>

          <div className={styles.filtersScroll}>
            <div role="group" aria-label="Filter projects" className={styles.filters}>
              <span
                aria-hidden="true"
                className={styles.indicator}
                style={{ width: indicator.w, transform: `translate3d(${indicator.x}px,0,0)` }}
              />
              {filters.map((f) => {
                const count = f.id === "all" ? work.length : work.filter((item) => item.category === f.id).length;
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
              key={item.id}
              item={item}
              wide={featured && i === 0}
              delay={i * 50}
              onOpen={() => setActiveId(item.id)}
            />
          ))}
          {showCta && (
            <a href="#contact" className={styles.cta} style={{ animationDelay: `${list.length * 50}ms` }}>
              <span className={styles.ctaKicker}>Your project</span>
              <span className={styles.ctaBody}>
                <span className={styles.ctaTitle}>Could be the next one here.</span>
                <span className={styles.ctaLink}>
                  Start a project <ArrowRightIcon />
                </span>
              </span>
            </a>
          )}
        </div>
      </div>

      <VideoDialog
        open={active !== null}
        onClose={() => setActiveId(null)}
        title={active?.title ?? ""}
        meta={active ? `${active.client} · ${categoryLabels[active.category]}` : undefined}
        src={active?.video}
        poster={active?.poster ?? "/media/house.jpg"}
        posterAlt={active?.posterAlt ?? ""}
        vertical={active?.vertical}
        counter={active ? `${pad(activeIndex + 1)} / ${pad(list.length)}` : undefined}
        onPrev={list.length > 1 ? () => step(-1) : undefined}
        onNext={list.length > 1 ? () => step(1) : undefined}
      />
    </section>
  );
}

type WorkCardProps = {
  item: WorkItem;
  wide: boolean;
  delay: number;
  onOpen: () => void;
};

function WorkCard({ item, wide, delay, onOpen }: WorkCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const canPreview = () =>
    Boolean(item.video) &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const startPreview = () => {
    const video = videoRef.current;
    if (!video || !canPreview()) return;
    video.play().catch(() => {});
  };

  const stopPreview = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.dataset.visible = "false";
  };

  return (
    <button
      type="button"
      className={`${styles.card} ${wide ? styles.wide : ""}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onOpen}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      aria-label={`Play ${item.title} — ${item.client}`}
    >
      <Image
        src={item.poster}
        alt={item.posterAlt}
        fill
        sizes={wide ? "(min-width: 1024px) 792px, 100vw" : "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"}
        className={styles.poster}
        style={item.posterPosition ? { objectPosition: item.posterPosition } : undefined}
      />
      {item.video && (
        <video
          ref={videoRef}
          className={styles.preview}
          src={item.video}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          data-visible="false"
          onPlaying={(e) => {
            e.currentTarget.dataset.visible = "true";
          }}
        />
      )}
      <span className={styles.cardShade} />
      <span className={styles.badge}>{categoryLabels[item.category]}</span>
      <span className={styles.cardFoot}>
        <span className={styles.cardText}>
          <span className={styles.cardTitle}>{item.title}</span>
          <span className={styles.cardClient}>{item.client}</span>
        </span>
        <span className={styles.play}>
          <PlayIcon />
        </span>
      </span>
    </button>
  );
}
