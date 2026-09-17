"use client";

import { stegaClean } from "next-sanity";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { PauseIcon, PlayIcon } from "@/components/icons";
import { useAfterLoad } from "@/lib/use-after-load";
import { urlFor } from "@/sanity/image";
import type { HomeData } from "@/sanity/types";

import styles from "./Hero.module.css";
import { VideoDialog } from "@/components/VideoDialog";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

type HeroProps = { hero: NonNullable<HomeData["hero"]> };

export function Hero({ hero }: HeroProps) {
  const showreel = stegaClean(hero.showreel) ?? undefined;
  const poster = hero.poster?.asset?._id ? urlFor(hero.poster.asset._id).width(1920).url() : undefined;

  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  // null = follow the reduced-motion preference until the visitor toggles playback.
  const [override, setOverride] = useState<boolean | null>(null);
  const [reelOpen, setReelOpen] = useState(false);
  // The background video starts downloading only after the page has loaded, so it never competes with the first paint.
  const videoReady = useAfterLoad();
  const playing = override ?? !reducedMotion;

  // The background loop also pauses while the full showreel is open.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoReady) return;
    if (reelOpen || !playing) video.pause();
    else video.play().catch(() => setOverride(false));
  }, [reelOpen, playing, videoReady]);

  return (
    <section className={styles.hero}>
      <video
        ref={videoRef}
        className={styles.media}
        src={videoReady ? showreel : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />
      <div className={styles.shade} />

      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>{hero.title}</h1>
        <div className={styles.row}>
          {hero.subtitle && <p className={styles.subtitle}>{hero.subtitle}</p>}
          <div className={styles.actions}>
            {showreel && (
              <button type="button" className={`btn btn-glass ${styles.reelButton}`} onClick={() => setReelOpen(true)}>
                <span className={styles.reelIcon}>
                  <PlayIcon />
                </span>
                Watch showreel
              </button>
            )}
            {hero.ctaLabel && (
              <a href="#contact" className="btn btn-red">
                {hero.ctaLabel}
              </a>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.pause}
        onClick={() => setOverride(!playing)}
        aria-label={playing ? "Pause background video" : "Play background video"}
      >
        {playing ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
      </button>

      <VideoDialog
        open={reelOpen}
        onClose={() => setReelOpen(false)}
        title="GAMMA5 Showreel"
        src={showreel}
        poster={poster ?? ""}
        posterAlt={hero.poster?.alt ?? "Showreel"}
      />
    </section>
  );
}
