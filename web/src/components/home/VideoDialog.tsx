"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/icons";

import styles from "./VideoDialog.module.css";

type VideoDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  meta?: string;
  src?: string;
  poster: string;
  posterAlt: string;
  vertical?: boolean;
  counter?: string;
  onPrev?: () => void;
  onNext?: () => void;
};

export function VideoDialog({
  open,
  onClose,
  title,
  meta,
  src,
  poster,
  posterAlt,
  vertical,
  counter,
  onPrev,
  onNext,
}: VideoDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {open && (
        <div className={styles.panel}>
          <div className={styles.head}>
            <div className={styles.titles}>
              {meta && <span className={styles.meta}>{meta}</span>}
              <span className={styles.title}>{title}</span>
            </div>
            <div className={styles.controls}>
              {counter && <span className={styles.counter}>{counter}</span>}
              {onPrev && (
                <button type="button" className={styles.round} onClick={onPrev} aria-label="Previous project">
                  <ChevronLeftIcon />
                </button>
              )}
              {onNext && (
                <button type="button" className={styles.round} onClick={onNext} aria-label="Next project">
                  <ChevronRightIcon />
                </button>
              )}
              <button type="button" className={`${styles.round} ${styles.close}`} onClick={onClose} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className={[styles.frame, src ? "" : styles.placeholder, vertical ? styles.vertical : ""].join(" ")}>
            {src ? (
              <video key={src} className={styles.video} src={src} poster={poster} controls autoPlay playsInline />
            ) : (
              <>
                <Image src={poster} alt={posterAlt} fill sizes="(min-width: 1280px) 1200px, 100vw" className={styles.poster} />
                <span className={styles.soon}>Video coming soon</span>
              </>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
