"use client";

import { useEffect, useId, useState } from "react";

import { Logo } from "@/components/Logo";
import { CloseIcon, MenuIcon } from "@/components/icons";

import styles from "./Header.module.css";

const links = [
  { href: "#about", label: "About" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <a href="#top" className={styles.logo} aria-label="GAMMA5 — home">
          <Logo />
        </a>

        <nav aria-label="Primary" className={styles.nav}>
          {links.map((link) => (
            <a key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href="#contact" className={`btn btn-red ${styles.cta}`}>
            Contact us
          </a>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav id={menuId} aria-label="Mobile" className={styles.mobileMenu}>
          {links.map((link) => (
            <a key={link.href} href={link.href} className={styles.mobileLink} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
