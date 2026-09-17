import { ArrowUpRightIcon } from "@/components/icons";
import { contactLinks } from "@/lib/site";
import type { HomeData, Settings } from "@/sanity/types";

import { BriefForm } from "./BriefForm";
import styles from "./Contact.module.css";

type ContactProps = { contact: NonNullable<HomeData["contact"]>; settings: Settings | null };

export function Contact({ contact, settings }: ContactProps) {
  const cards = contactLinks(settings);

  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <span className="eyebrow">Contact us</span>
          <h2 id="contact-title" className="section-title">
            {contact.title}
          </h2>
          {contact.lede && <p className={styles.lede}>{contact.lede}</p>}
          {cards.length > 0 && (
            <ul className={styles.cards}>
              {cards.map((card) => (
                <li key={card.key} className={card.key === "email" ? styles.wideCard : undefined}>
                  <a href={card.href} className={styles.card}>
                    <span className={styles.cardText}>
                      <span className={styles.cardLabel}>{card.label}</span>
                      <span className={styles.cardValue}>{card.value}</span>
                    </span>
                    <ArrowUpRightIcon className={styles.cardArrow} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.panel}>
          <BriefForm />
        </div>
      </div>
    </section>
  );
}
