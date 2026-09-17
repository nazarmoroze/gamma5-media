import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";

import styles from "./CtaBand.module.css";

export function CtaBand({ title }: { title: string }) {
  return (
    <section className={styles.band} aria-label="Start a project">
      <div className={`container ${styles.inner}`}>
        <h2 className={styles.title}>{title}</h2>
        <Link href="/#contact" className="btn btn-red">
          Discuss your project
          <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}
