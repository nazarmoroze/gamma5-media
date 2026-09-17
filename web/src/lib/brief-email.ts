// Notification email for a quote request from the contact form.
// Table layout with inline styles so it renders the same in Gmail, Apple Mail and Outlook.

export type ReplyMethod = "email" | "whatsapp" | "telegram";

// Hidden form field that people never see; bots that fill every input get a fake success.
export const HONEYPOT_FIELD = "company_website";

export type BriefEmailInput = {
  name: string;
  method: ReplyMethod;
  contact: string;
  receivedAt: Date;
  // Link to the saved request in Sanity Studio, when it was saved.
  studioUrl?: string;
};

const METHOD_LABEL: Record<ReplyMethod, string> = { email: "Email", whatsapp: "WhatsApp", telegram: "Telegram" };

const REPLY_LABEL: Record<ReplyMethod, string> = {
  email: "Reply by email",
  whatsapp: "Reply on WhatsApp",
  telegram: "Message on Telegram",
};

const RED = "#E41E1D";
const INK = "#0A0A0A";
const MUTED = "#6B6B6B";
const LINE = "#ECECEA";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Subject and header values must stay on one line.
function oneLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function replyHref(method: ReplyMethod, contact: string, name: string) {
  const firstName = name.split(/\s+/)[0] || name;
  if (method === "email") {
    return `mailto:${contact}?subject=${encodeURIComponent("Your video project with GAMMA5")}`;
  }
  if (method === "whatsapp") {
    const text = `Hi ${firstName}, this is GAMMA5. Thanks for your request!`;
    return `https://wa.me/${contact.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
  }
  return `https://t.me/${contact.replace(/^@/, "")}`;
}

export function formatReceivedAt(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Nicosia",
  }).format(date);
}

export function renderBriefEmail({ name, method, contact, receivedAt, studioUrl }: BriefEmailInput) {
  const methodLabel = METHOD_LABEL[method];
  const contactShown = method === "telegram" ? `@${contact.replace(/^@/, "")}` : contact;
  const href = replyHref(method, contact, name);
  const when = formatReceivedAt(receivedAt);

  const subject = oneLine(`New quote request: ${name} via ${methodLabel}`);
  const preheader = `${name} wants a quote. Reply via ${methodLabel}: ${contactShown}`;

  const e = {
    name: escapeHtml(name),
    contact: escapeHtml(contactShown),
    href: escapeHtml(href),
    when: escapeHtml(when),
    preheader: escapeHtml(preheader),
    studioUrl: studioUrl ? escapeHtml(studioUrl) : "",
  };

  const row = (label: string, value: string, last = false) => `
              <tr>
                <td style="padding:14px 0;${last ? "" : `border-bottom:1px solid ${LINE};`}font-size:14px;line-height:20px;color:${MUTED};width:120px;vertical-align:top;">${label}</td>
                <td style="padding:14px 0;${last ? "" : `border-bottom:1px solid ${LINE};`}font-size:16px;line-height:22px;color:${INK};font-weight:600;vertical-align:top;">${value}</td>
              </tr>`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#F4F4F2;-webkit-text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${e.preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F4F2;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
            <tr>
              <td style="background:${INK};border-radius:16px 16px 0 0;padding:20px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size:20px;line-height:24px;font-weight:800;letter-spacing:-0.5px;color:#FFFFFF;">GAMMA5</td>
                    <td align="right" style="font-size:12px;line-height:16px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:#FFFFFF;">
                      <span style="display:inline-block;width:8px;height:8px;border-radius:4px;background:${RED};vertical-align:middle;margin-right:6px;"></span>New request
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#FFFFFF;padding:32px 28px 8px;">
                <p style="margin:0 0 6px;font-size:14px;line-height:20px;color:${MUTED};">Quote request from the website</p>
                <h1 style="margin:0;font-size:28px;line-height:34px;font-weight:700;letter-spacing:-0.6px;color:${INK};">${e.name}</h1>
                <p style="margin:8px 0 0;font-size:15px;line-height:22px;color:${MUTED};">Wants a reply via <strong style="color:${INK};">${methodLabel}</strong></p>
              </td>
            </tr>
            <tr>
              <td style="background:#FFFFFF;padding:16px 28px 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">${row(
                  methodLabel,
                  `<a href="${e.href}" style="color:${INK};text-decoration:underline;">${e.contact}</a>`,
                )}${row("Received", `${e.when} <span style="font-weight:400;color:${MUTED};">Cyprus time</span>`, true)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#FFFFFF;padding:24px 28px 32px;border-radius:0 0 16px 16px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="border-radius:999px;background:${RED};">
                      <a href="${e.href}" style="display:inline-block;padding:14px 28px;font-size:16px;line-height:20px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:999px;">${REPLY_LABEL[method]} &rarr;</a>
                    </td>
                  </tr>
                </table>${
                  e.studioUrl
                    ? `
                <p style="margin:20px 0 0;font-size:14px;line-height:20px;color:${MUTED};">Saved in Sanity Studio. <a href="${e.studioUrl}" style="color:${INK};font-weight:600;">Open request</a></p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 0;font-size:12px;line-height:18px;color:#9A9A98;text-align:center;">
                Sent automatically from the contact form on gamma5media.com${method === "email" ? ".<br />Replying to this email answers the client directly." : "."}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `New quote request from the website`,
    ``,
    `Name: ${name}`,
    `Reply via: ${methodLabel}`,
    `${methodLabel}: ${contactShown}`,
    `Received: ${when} (Cyprus time)`,
    ``,
    `${REPLY_LABEL[method]}: ${href}`,
    ...(studioUrl ? [``, `Open in Sanity Studio: ${studioUrl}`] : []),
  ].join("\n");

  return { subject, html, text };
}
