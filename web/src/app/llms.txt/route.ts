import { caseHref, categoryLabel } from "@/components/work/types";
import { siteUrl } from "@/lib/site";
import { client } from "@/sanity/client";
import { CASES_QUERY, HOME_QUERY, SETTINGS_QUERY, WORK_PAGE_QUERY } from "@/sanity/queries";

export const revalidate = 3600;

// A plain-text summary of the site for AI assistants (llmstxt.org), built from the same Sanity content as the pages.
export async function GET() {
  const options = { perspective: "published" as const };
  const [settings, home, work, cases] = await Promise.all([
    client.fetch(SETTINGS_QUERY, {}, options),
    client.fetch(HOME_QUERY, {}, options),
    client.fetch(WORK_PAGE_QUERY, {}, options),
    client.fetch(CASES_QUERY, {}, options),
  ]);

  const name = settings?.name || "GAMMA5";
  const lines: string[] = [`# ${name}`, ""];

  if (home?.seo?.description) lines.push(`> ${home.seo.description}`, "");
  const about = [home?.about?.heading, home?.about?.lead, home?.about?.body].filter(Boolean).join(" ");
  if (about) lines.push(about, "");
  if (settings?.registeredName) lines.push(`${name} is a brand of ${settings.registeredName}.`, "");

  lines.push(
    "## Pages",
    `- [Home](${siteUrl}): ${home?.seo?.title ?? "Video production company in Cyprus"}`,
    `- [${work?.seo?.title ?? "Video Production Portfolio"}](${siteUrl}/work)${work?.seo?.description ? `: ${work.seo.description}` : ""}`,
    `- [Privacy Policy](${siteUrl}/privacy-policy)`,
    "",
  );

  const listed = cases.filter((item) => item.slug && item.title);
  if (listed.length) {
    lines.push("## Case studies");
    for (const item of listed) {
      const details = [categoryLabel(item.category), item.client ? `for ${item.client}` : null, item.year].filter(Boolean).join(" ");
      lines.push(`- [${item.title}](${siteUrl}${caseHref(item.slug)})${details ? `: ${details}` : ""}`);
    }
    lines.push("");
  }

  const faq = home?.faq?.items?.filter((item) => item.question && item.answer) ?? [];
  if (faq.length) {
    lines.push("## FAQ");
    for (const item of faq) lines.push(`- ${item.question} ${item.answer}`);
    lines.push("");
  }

  const contacts = [
    settings?.email ? `- Email: ${settings.email}` : null,
    settings?.phone ? `- Phone and WhatsApp: ${settings.phone}` : null,
    settings?.telegram ? `- Telegram: https://t.me/${settings.telegram}` : null,
    settings?.instagram ? `- Instagram: https://www.instagram.com/${settings.instagram}/` : null,
    settings?.linkedin ? `- LinkedIn: ${settings.linkedin}` : null,
    `- Contact form: ${siteUrl}/#contact`,
  ].filter(Boolean) as string[];
  lines.push("## Contact", ...contacts, "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
