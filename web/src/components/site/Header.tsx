"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

import { Logo } from "@/components/Logo";
import { ArrowUpRightIcon } from "@/components/icons";
import { contactLinks, newTab } from "@/lib/site";
import type { Settings } from "@/sanity/types";

import styles from "./Header.module.css";

const links = [
  { href: "/#about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

// Stagger index for the menu reveal, read by the CSS transition delays.
const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

const MENU_SOCIALS = ["whatsapp", "telegram", "instagram"];

export function Header({ settings }: { settings: Settings | null }) {
  const contacts = contactLinks(settings);
  const email = contacts.find((link) => link.key === "email");
  const socials = contacts.filter((link) => MENU_SOCIALS.includes(link.key));

  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    firstLinkRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    // The overlay only exists on small screens; close it if the viewport grows.
    const desktop = window.matchMedia("(min-width: 900px)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={styles.header} data-open={open} style={{ viewTransitionName: "site-header" }}>
      <div className={styles.bar}>
        <Link href="/" className={styles.logo} aria-label="GAMMA5 — home" onClick={close}>
          <Logo />
        </Link>

        <nav aria-label="Primary" className={styles.nav}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/#contact" className={`btn btn-red ${styles.cta}`} onClick={close}>
            Contact us
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.burgerLine} aria-hidden="true" />
            <span className={styles.burgerLine} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id={menuId} className={styles.overlay} data-open={open} inert={!open}>
        <nav aria-label="Mobile" className={styles.menuNav}>
          <ol className={styles.menuList}>
            {links.map((link, i) => (
              <li key={link.href} className={styles.menuItem} style={stagger(i)}>
                <Link
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  className={styles.menuLink}
                  onClick={close}
                >
                  <span className={styles.menuIndex}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.menuMask}>
                    <span className={styles.menuLabel}>{link.label}</span>
                  </span>
                  <span className={styles.menuArrow}>
                    <ArrowUpRightIcon size={20} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className={styles.menuFoot}>
          {email && (
            <div className={styles.reveal} style={stagger(links.length)}>
              <span className={styles.footLabel}>Get in touch</span>
              <a href={email.href} className={styles.footEmail} onClick={close} {...newTab}>
                {email.value}
              </a>
            </div>
          )}
          <div className={`${styles.reveal} ${styles.socials}`} style={stagger(links.length + 1)}>
            {socials.map((link) => (
              <a key={link.key} href={link.href} className={styles.social} {...newTab}>
                {link.label}
              </a>
            ))}
          </div>
          <Link
            href="/#contact"
            className={`btn btn-red ${styles.reveal} ${styles.footCta}`}
            style={stagger(links.length + 2)}
            onClick={close}
          >
            Discuss your project
          </Link>
        </div>
      </div>
    </header>
  );
}
