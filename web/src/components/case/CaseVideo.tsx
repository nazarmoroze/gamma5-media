"use client";

import { stegaClean } from "next-sanity";
import { useState } from "react";

import { SanityImage } from "@/components/SanityImage";
import { PlayIcon } from "@/components/icons";

import type { CaseDetail } from "../work/types";
import styles from "./CaseVideo.module.css";

type CaseVideoProps = {
  title: string;
  cover: CaseDetail["cover"];
  fullVideo: string | null;
  previewVideo: string | null;
  vertical: boolean;
};

export function CaseVideo({ title, cover, fullVideo, previewVideo, vertical }: CaseVideoProps) {
  const [playing, setPlaying] = useState(false);
  const frameClass = `${styles.frame} ${vertical ? styles.vertical : ""}`;

  if (fullVideo) {
    return (
      <div className={frameClass}>
        {playing ? (
          <video className={styles.video} src={stegaClean(fullVideo)} controls autoPlay playsInline />
        ) : (
          <>
            <SanityImage image={cover} sizes="(min-width: 1280px) 1200px, 100vw" preload />
            <button type="button" className={styles.play} onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
              <span className={styles.playIcon}>
                <PlayIcon size={26} />
              </span>
              <span className={styles.playLabel}>Watch the film</span>
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={frameClass}>
      <SanityImage image={cover} sizes="(min-width: 1280px) 1200px, 100vw" preload />
      {previewVideo && (
        <video className={styles.video} src={stegaClean(previewVideo)} autoPlay muted loop playsInline aria-hidden="true" />
      )}
      <span className={styles.note}>{previewVideo ? "Preview · full film coming soon" : "Film coming soon"}</span>
    </div>
  );
}
