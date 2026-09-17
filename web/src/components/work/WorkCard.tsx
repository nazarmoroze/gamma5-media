"use client";

import Link from "next/link";
import { useRef } from "react";

import { SanityImage } from "@/components/SanityImage";
import { PlayIcon } from "@/components/icons";

import styles from "./WorkGrid.module.css";
import { caseHref, categoryLabel, type CaseSummary } from "./types";

type WorkCardProps = {
  item: CaseSummary;
  delay: number;
  onPlay: () => void;
};

export function WorkCard({ item, delay, onPlay }: WorkCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const startPreview = () => {
    const video = videoRef.current;
    if (!video) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (canHover && !reduced) video.play().catch(() => {});
  };

  const stopPreview = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    video.dataset.visible = "false";
  };

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
    >
      <SanityImage
        image={item.cover}
        sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
        className={styles.poster}
      />
      {item.previewVideo && (
        <video
          ref={videoRef}
          className={styles.preview}
          src={item.previewVideo}
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

      {/* The whole card opens the player; the title stays a real link to the case page. */}
      <button type="button" className={styles.cardButton} onClick={onPlay} aria-label={`Play ${item.title}`} />

      <span className={styles.badge}>{categoryLabel(item.category)}</span>
      <span className={styles.cardFoot}>
        <span className={styles.cardText}>
          <Link href={caseHref(item.slug)} className={styles.cardTitle}>
            {item.title}
          </Link>
          <span className={styles.cardClient}>{item.client}</span>
        </span>
        <span className={styles.play} aria-hidden="true">
          <PlayIcon />
        </span>
      </span>
    </article>
  );
}
