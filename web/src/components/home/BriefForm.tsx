"use client";

import { useActionState, useState } from "react";

import { sendBrief, type BriefState, type ProjectKind, type ReplyMethod } from "@/app/actions";
import { CheckIcon } from "@/components/icons";

import styles from "./Contact.module.css";

const methods: Record<ReplyMethod, { label: string; field: string; type: string; autoComplete: string; placeholder: string }> = {
  email: { label: "Email", field: "Email address", type: "email", autoComplete: "email", placeholder: "you@company.com" },
  whatsapp: { label: "WhatsApp", field: "WhatsApp number", type: "tel", autoComplete: "tel", placeholder: "+357 00 000000" },
  telegram: { label: "Telegram", field: "Telegram username", type: "text", autoComplete: "off", placeholder: "@username" },
};

const kinds: { id: ProjectKind; label: string }[] = [
  { id: "commercial", label: "Commercial" },
  { id: "youtube", label: "YouTube" },
  { id: "short", label: "Short content" },
  { id: "other", label: "Something else" },
];

const initialState: BriefState = { status: "idle" };

export function BriefForm() {
  const [state, formAction, pending] = useActionState(sendBrief, initialState);
  const [method, setMethod] = useState<ReplyMethod>("email");
  const [kind, setKind] = useState<ProjectKind>("commercial");
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : { name: "", contact: "", message: "" };
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

      <fieldset className={styles.fieldset}>
        <legend className={styles.label}>What do you need?</legend>
        <input type="hidden" name="kind" value={kind} />
        <div className={styles.chips}>
          {kinds.map((k) => (
            <button key={k.id} type="button" className={styles.chip} aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
              {k.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className={styles.field}>
        <span className={styles.label}>About the project</span>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          name="message"
          defaultValue={values.message}
          rows={4}
          placeholder="Goal, deadline, budget — whatever you already know."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "brief-message-error" : undefined}
        />
        {errors.message && (
          <span id="brief-message-error" className={styles.error}>
            {errors.message}
          </span>
        )}
      </label>

      <button type="submit" className={`btn btn-red ${styles.submit}`} disabled={pending}>
        {pending ? "Sending…" : "Send request"}
      </button>
    </form>
  );
}
