"use client";

import { stegaClean } from "next-sanity";
import { useState } from "react";

import { SanityImage } from "@/components/SanityImage";
import { PlayIcon } from "@/components/icons";
import { useAfterLoad } from "@/lib/use-after-load";
import { youtubeEmbedSrc, youtubeId } from "@/lib/youtube";

import { videoAspect } from "../work/aspect";
import type { CaseDetail } from "../work/types";
import styles from "./CaseVideo.module.css";

type CaseVideoProps = {
  title: string;
  cover: CaseDetail["cover"];
  fullVideo: string | null;
  youtubeUrl: string | null;
  previewVideo: string | null;
  vertical: boolean;
  videoAspect: string | null;
};

export function CaseVideo({ title, cover, fullVideo, youtubeUrl, previewVideo, vertical, videoAspect: videoAspectValue }: CaseVideoProps) {
  const [playing, setPlaying] = useState(false);
  // The looping preview waits until the page has loaded so the cover image paints first.
  const previewReady = useAfterLoad();
  const frameClass = `${styles.frame} ${vertical ? styles.vertical : ""}`;
  // The film sets the shape of the frame, so the player has no black bars around it.
  const frameStyle = { aspectRatio: videoAspect(videoAspectValue, vertical).css };
  const youtube = youtubeId(stegaClean(youtubeUrl));

  if (youtube) {
    return (
      <div className={frameClass} style={frameStyle}>
        {playing ? (
          <iframe
            className={styles.video}
            src={youtubeEmbedSrc(youtube)}
            title={title}
            allow="accelerator; autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
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

  if (fullVideo) {
    return (
      <div className={frameClass} style={frameStyle}>
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
    <div className={frameClass} style={frameStyle}>
      <SanityImage image={cover} sizes="(min-width: 1280px) 1200px, 100vw" preload />
      {previewVideo && previewReady && (
        <video className={styles.video} src={stegaClean(previewVideo)} autoPlay muted loop playsInline aria-hidden="true" />
      )}
      <span className={styles.note}>{previewVideo ? "Preview · full film coming soon" : "Film coming soon"}</span>
    </div>
  );
}
