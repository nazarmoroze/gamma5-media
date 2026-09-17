"use server";

import { HONEYPOT_FIELD, renderBriefEmail, type ReplyMethod } from "@/lib/brief-email";
import { sendMail } from "@/lib/mailer";
import { studioUrl } from "@/sanity/env";
import { writeClient } from "@/sanity/write-client";

export type { ReplyMethod };

export type BriefState =
  | { status: "idle" }
  | {
      status: "error";
      errors: Partial<Record<"name" | "contact" | "form", string>>;
      // React resets the form after an action, so the entered values come back as defaults.
      values: { name: string; contact: string };
    }
  | { status: "success"; method: ReplyMethod; at: number };

const METHODS: ReplyMethod[] = ["email", "whatsapp", "telegram"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
const TELEGRAM_RE = /^@?[A-Za-z0-9_]{5,32}$/;

export async function sendBrief(_prev: BriefState, formData: FormData): Promise<BriefState> {
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const methodRaw = String(formData.get("method") ?? "");

  const method = METHODS.includes(methodRaw as ReplyMethod) ? (methodRaw as ReplyMethod) : "email";

  if (String(formData.get(HONEYPOT_FIELD) ?? "").trim()) {
    return { status: "success", method, at: Date.now() };
  }

  const errors: Partial<Record<"name" | "contact", string>> = {};
  if (name.length < 2 || name.length > 100) errors.name = "Please enter your name.";
  if (method === "email" && !EMAIL_RE.test(contact)) errors.contact = "Please enter a valid email address.";
  if (method === "whatsapp" && !PHONE_RE.test(contact)) errors.contact = "Please enter a valid phone number.";
  if (method === "telegram" && !TELEGRAM_RE.test(contact)) errors.contact = "Please enter your Telegram username.";

  if (Object.keys(errors).length > 0) return { status: "error", errors, values: { name, contact } };

  const receivedAt = new Date();
  const normalizedContact = method === "telegram" ? contact.replace(/^@/, "") : contact;

  // A dot in the ID keeps the request out of unauthenticated reads of the public dataset.
  const id = `request.${crypto.randomUUID()}`;
  let saved = false;
  if (writeClient) {
    try {
      await writeClient.create({
        _id: id,
        _type: "quoteRequest",
        status: "new",
        name,
        method,
        contact: normalizedContact,
        receivedAt: receivedAt.toISOString(),
        emailSent: false,
      });
      saved = true;
    } catch (error) {
      console.error("Failed to save quote request to Sanity", error);
    }
  }

  let emailed = false;
  try {
    const email = renderBriefEmail({
      name,
      method,
      contact: normalizedContact,
      receivedAt,
      studioUrl: saved ? `${studioUrl}/intent/edit/id=${id};type=quoteRequest/` : undefined,
    });
    await sendMail({ ...email, replyTo: method === "email" ? normalizedContact : undefined });
    emailed = true;
  } catch (error) {
    console.error("Failed to send quote request email", error);
  }

  if (saved && emailed && writeClient) {
    await writeClient
      .patch(id)
      .set({ emailSent: true })
      .commit()
      .catch((error) => console.error("Failed to mark quote request as emailed", error));
  }

  if (!saved && !emailed) {
    return {
      status: "error",
      errors: { form: "We couldn’t send your request. Please try again or reach us directly." },
      values: { name, contact },
    };
  }

  return { status: "success", method, at: Date.now() };
}
