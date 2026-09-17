"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/icons";

import styles from "./VideoDialog.module.css";

type VideoDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  meta?: string;
  src?: string;
  /** Set when `src` is only the short preview loop: it plays muted on repeat with this note. */
  previewNote?: string;
  poster: string;
  posterAlt: string;
  vertical?: boolean;
  action?: { href: string; label: string };
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
  previewNote,
  poster,
  posterAlt,
  vertical,
  action,
  counter,
  onPrev,
  onNext,
}: VideoDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // showModal() focuses the first button, which shows a focus ring on "Previous" for mouse users too.
      // Focus the dialog itself instead; Tab still moves to the controls with a visible ring.
      dialog.focus();
    }
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
      tabIndex={-1}
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
              <button
                type="button"
                className={`${styles.round} ${styles.close}`}
                onClick={onClose}
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className={[styles.frame, src ? "" : styles.placeholder, vertical ? styles.vertical : ""].join(" ")}>
            {src && !previewNote && (
              <video key={src} className={styles.video} src={src} poster={poster} controls autoPlay playsInline />
            )}
            {src && previewNote && (
              <>
                <video key={src} className={styles.video} src={src} poster={poster} autoPlay muted loop playsInline />
                <span className={styles.note}>{previewNote}</span>
              </>
            )}
            {!src && (
              <>
                <Image
                  src={poster}
                  alt={posterAlt}
                  fill
                  unoptimized
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  className={styles.poster}
                />
                <span className={styles.soon}>Video coming soon</span>
              </>
            )}
          </div>

          {action && (
            <div className={styles.foot}>
              <Link href={action.href} className={`btn btn-red ${styles.action}`}>
                {action.label}
                <ArrowRightIcon />
              </Link>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
