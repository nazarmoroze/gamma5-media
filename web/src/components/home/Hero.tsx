"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { PauseIcon, PlayIcon } from "@/components/icons";
import { hero } from "@/content/home";

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

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  // null = follow the reduced-motion preference until the visitor toggles playback.
  const [override, setOverride] = useState<boolean | null>(null);
  const [reelOpen, setReelOpen] = useState(false);
  const playing = override ?? !reducedMotion;

  // The background loop also pauses while the full showreel is open.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reelOpen || !playing) video.pause();
    else video.play().catch(() => setOverride(false));
  }, [reelOpen, playing]);

  return (
    <section className={styles.hero}>
      <video
        ref={videoRef}
        className={styles.media}
        src={hero.showreel.src}
        poster={hero.showreel.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className={styles.shade} />

      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>{hero.title}</h1>
        <div className={styles.row}>
          <p className={styles.subtitle}>{hero.subtitle}</p>
          <div className={styles.actions}>
            <button type="button" className={`btn btn-glass ${styles.reelButton}`} onClick={() => setReelOpen(true)}>
              <span className={styles.reelIcon}>
                <PlayIcon />
              </span>
              Watch showreel
            </button>
            <a href="#contact" className="btn btn-red">
              {hero.cta}
            </a>
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
        src={hero.showreel.src}
        poster={hero.showreel.poster}
        posterAlt="GAMMA5 showreel"
      />
    </section>
  );
}
