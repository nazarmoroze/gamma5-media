import { ArrowUpRightIcon } from "@/components/icons";
import { contact, contacts } from "@/content/home";

import { BriefForm } from "./BriefForm";
import styles from "./Contact.module.css";

const cards = [
  { label: "Telegram", value: contacts.telegram.handle, href: contacts.telegram.href },
  { label: "WhatsApp", value: contacts.whatsapp.label, href: contacts.whatsapp.href },
  { label: "Email", value: contacts.email, href: `mailto:${contacts.email}`, wide: true },
  { label: "Instagram", value: contacts.instagram.handle, href: contacts.instagram.href },
  { label: "LinkedIn", value: contacts.linkedin.label, href: contacts.linkedin.href },
];

export function Contact() {
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <span className="eyebrow">Contact us</span>
          <h2 id="contact-title" className="section-title">
            {contact.title}
          </h2>
          <p className={styles.lede}>{contact.lede}</p>
          <ul className={styles.cards}>
            {cards.map((card) => (
              <li key={card.label} className={card.wide ? styles.wideCard : undefined}>
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
        </div>

        <div className={styles.panel}>
          <BriefForm />
        </div>
      </div>
    </section>
  );
}
