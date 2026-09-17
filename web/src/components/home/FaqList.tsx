"use client";

import { useRef, type MouseEvent, type SyntheticEvent } from "react";

import type { HomeData } from "@/sanity/types";

import styles from "./Faq.module.css";

type FaqItem = NonNullable<NonNullable<HomeData["faq"]>["items"]>[number];

// Responds right away and settles gently, since the answer and everything below it move.
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const OPEN_MS = 440;
const CLOSE_MS = 360;

type Running = { height: Animation; fade: Animation };

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Native <details> keeps find-in-page and no-JS behaviour; the height is animated with WAAPI,
// which works in every browser and can be reversed mid-way.
export function FaqList({ items }: { items: FaqItem[] }) {
  const running = useRef(new WeakMap<HTMLDetailsElement, Running>());

  function stop(details: HTMLDetailsElement) {
    const current = running.current.get(details);
    current?.height.cancel();
    current?.fade.cancel();
    running.current.delete(details);
  }

  function parts(details: HTMLDetailsElement) {
    const panel = details.querySelector<HTMLElement>(`.${styles.panel}`)!;
    return { panel, answer: panel.firstElementChild as HTMLElement };
  }

  function open(details: HTMLDetailsElement) {
    const { panel, answer } = parts(details);
    const from = running.current.has(details) ? panel.offsetHeight : 0;
    stop(details);

    details.dataset.state = "open";
    details.open = true;
    if (prefersReducedMotion()) return;

    const to = panel.offsetHeight;
    const height = panel.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: OPEN_MS, easing: EASE });
    const fade = answer.animate(
      [
        { opacity: 0, transform: "translate3d(0, -8px, 0)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 380, delay: from === 0 ? 60 : 0, easing: "ease-out", fill: "backwards" },
    );
    running.current.set(details, { height, fade });
    height.onfinish = () => stop(details);
  }

  function close(details: HTMLDetailsElement) {
    const { panel, answer } = parts(details);
    details.dataset.state = "closed";

    if (prefersReducedMotion()) {
      stop(details);
      details.open = false;
      return;
    }

    const from = panel.offsetHeight;
    stop(details);

    const height = panel.animate([{ height: `${from}px` }, { height: "0px" }], { duration: CLOSE_MS, easing: EASE });
    const fade = answer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: "ease-out", fill: "forwards" });
    running.current.set(details, { height, fade });
    height.onfinish = () => {
      details.open = false;
      stop(details);
    };
  }

  function closeOthers(details: HTMLDetailsElement) {
    details.parentElement
      ?.querySelectorAll<HTMLDetailsElement>('details[data-state="open"]')
      .forEach((other) => other !== details && close(other));
  }

  function onSummaryClick(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    const details = event.currentTarget.parentElement as HTMLDetailsElement;

    if (details.dataset.state === "open") {
      close(details);
    } else {
      // Only one answer stays open at a time.
      closeOthers(details);
      open(details);
    }
  }

  // Keeps the state in sync when the browser opens an item itself, e.g. find-in-page.
  function onToggle(event: SyntheticEvent<HTMLDetailsElement>) {
    const details = event.currentTarget;
    if (details.open && details.dataset.state !== "open") {
      closeOthers(details);
      details.dataset.state = "open";
    }
  }

  return (
    <div className={styles.list}>
      {items.map((item) => (
        <details key={item._key} className={styles.item} data-state="closed" onToggle={onToggle}>
          <summary className={styles.question} onClick={onSummaryClick}>
            <h3 className={styles.questionText}>{item.question}</h3>
            <span className={styles.icon} aria-hidden="true" />
          </summary>
          <div className={styles.panel}>
            <p className={styles.answer}>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
