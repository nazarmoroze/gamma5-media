"use server";

export type ReplyMethod = "email" | "whatsapp" | "telegram";

export type BriefState =
  | { status: "idle" }
  | {
      status: "error";
      errors: Partial<Record<"name" | "contact", string>>;
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

  const errors: Partial<Record<"name" | "contact", string>> = {};
  if (name.length < 2 || name.length > 100) errors.name = "Please enter your name.";
  if (method === "email" && !EMAIL_RE.test(contact)) errors.contact = "Please enter a valid email address.";
  if (method === "whatsapp" && !PHONE_RE.test(contact)) errors.contact = "Please enter a valid phone number.";
  if (method === "telegram" && !TELEGRAM_RE.test(contact)) errors.contact = "Please enter your Telegram username.";

  if (Object.keys(errors).length > 0) return { status: "error", errors, values: { name, contact } };

  // TODO: deliver the request (email / Telegram notification). Nothing is sent yet.

  return { status: "success", method, at: Date.now() };
}
