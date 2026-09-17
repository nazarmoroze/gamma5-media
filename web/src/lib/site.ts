import { stegaClean } from "next-sanity";

import type { Settings } from "@/sanity/types";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://gamma5media.com").replace(/\/$/, "");

export type ContactLink = { key: string; label: string; value: string; href: string };

// Visible values keep Sanity's click-to-edit markers; hrefs are built from cleaned values.
export function contactLinks(settings: Settings | null) {
  if (!settings) return [];
  const clean = stegaClean(settings);
  const links: ContactLink[] = [];

  if (settings.telegram && clean.telegram) {
    links.push({ key: "telegram", label: "Telegram", value: `@${settings.telegram}`, href: `https://t.me/${clean.telegram}` });
  }
  if (settings.phone && clean.phone) {
    links.push({ key: "whatsapp", label: "WhatsApp", value: settings.phone, href: `https://wa.me/${clean.phone.replace(/\D/g, "")}` });
  }
  if (settings.email && clean.email) {
    links.push({ key: "email", label: "Email", value: settings.email, href: `mailto:${clean.email}` });
  }
  if (settings.instagram && clean.instagram) {
    links.push({ key: "instagram", label: "Instagram", value: settings.instagram, href: `https://www.instagram.com/${clean.instagram}/` });
  }
  if (clean.linkedin) {
    links.push({ key: "linkedin", label: "LinkedIn", value: settings.legalName || "LinkedIn", href: clean.linkedin });
  }
  return links;
}
