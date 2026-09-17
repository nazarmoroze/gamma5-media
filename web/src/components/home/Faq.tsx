import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import type { HomeData } from "@/sanity/types";

import styles from "./Faq.module.css";

type FaqProps = { faq: NonNullable<HomeData["faq"]> };

export function Faq({ faq }: FaqProps) {
  const items = faq.items?.filter((item) => item.question && item.answer) ?? [];

  return (
    <section id="faq" className={styles.faq} aria-labelledby="faq-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <span className="eyebrow">FAQ</span>
          <h2 id="faq-title" className="section-title">
            {faq.title}
          </h2>
          {faq.intro && <p className={styles.lede}>{faq.intro}</p>}
          <Link href="#contact" className={`btn btn-outline ${styles.ask}`}>
            Ask a question
            <ArrowRightIcon />
          </Link>
        </div>

        <div className={styles.list}>
          {items.map((item) => (
            <details key={item._key} name="faq" className={styles.item}>
              <summary className={styles.question}>
                <h3 className={styles.questionText}>{item.question}</h3>
                <span className={styles.icon} aria-hidden="true" />
              </summary>
              <p className={styles.answer}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
