"use client";

import { useActionState, useState } from "react";

import { sendBrief, type BriefState, type ReplyMethod } from "@/app/actions";
import { CheckIcon } from "@/components/icons";
import { HONEYPOT_FIELD } from "@/lib/brief-email";

import styles from "./Contact.module.css";

const methods: Record<ReplyMethod, { label: string; field: string; type: string; autoComplete: string; placeholder: string }> = {
  email: { label: "Email", field: "Email address", type: "email", autoComplete: "email", placeholder: "you@company.com" },
  whatsapp: { label: "WhatsApp", field: "WhatsApp number", type: "tel", autoComplete: "tel", placeholder: "+357 00 000000" },
  telegram: { label: "Telegram", field: "Telegram username", type: "text", autoComplete: "off", placeholder: "@username" },
};

const initialState: BriefState = { status: "idle" };

export function BriefForm() {
  const [state, formAction, pending] = useActionState(sendBrief, initialState);
  const [method, setMethod] = useState<ReplyMethod>("email");
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : { name: "", contact: "" };
  const showSuccess = state.status === "success" && state.at !== dismissedAt;
  const current = methods[method];

  if (showSuccess) {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successIcon}>
          <CheckIcon />
        </span>
        <span className={styles.successTitle}>Thanks, we got it</span>
        <span className={styles.successText}>We’ll get back to you via {methods[state.method].label} soon.</span>
        <button type="button" className="btn btn-outline" onClick={() => setDismissedAt(state.at)}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className={styles.form} noValidate>
      <div className={styles.formHead}>
        <span className={styles.formTitle}>Request a quote</span>
        <span className={styles.formHint}>A few details are enough — we’ll take it from there.</span>
      </div>

      <label className={styles.honeypot} aria-hidden="true">
        Leave this field empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Your name</span>
        <input
          className={styles.input}
          type="text"
          name="name"
          defaultValue={values.name}
          autoComplete="name"
          placeholder="Jane Doe"
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "brief-name-error" : undefined}
        />
        {errors.name && (
          <span id="brief-name-error" className={styles.error}>
            {errors.name}
          </span>
        )}
      </label>

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>Where should we reply?</legend>
        <input type="hidden" name="method" value={method} />
        <div className={styles.segmented}>
          {(Object.keys(methods) as ReplyMethod[]).map((id) => (
            <button
              key={id}
              type="button"
              className={styles.segment}
              aria-pressed={method === id}
              onClick={() => setMethod(id)}
            >
              {methods[id].label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className={styles.field}>
        <span className={styles.label}>{current.field}</span>
        <input
          key={method}
          className={styles.input}
          type={current.type}
          name="contact"
          defaultValue={values.contact}
          autoComplete={current.autoComplete}
          placeholder={current.placeholder}
          required
          aria-invalid={Boolean(errors.contact)}
          aria-describedby={errors.contact ? "brief-contact-error" : undefined}
        />
        {errors.contact && (
          <span id="brief-contact-error" className={styles.error}>
            {errors.contact}
          </span>
        )}
      </label>

      {errors.form && (
        <p className={styles.formError} role="alert">
          {errors.form}
        </p>
      )}

      <button type="submit" className={`btn btn-red ${styles.submit}`} disabled={pending}>
        {pending ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
