import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";
import type { HomeData } from "@/sanity/types";

import styles from "./Faq.module.css";
import { FaqList } from "./FaqList";

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

        <FaqList items={items} />
      </div>
    </section>
  );
}
