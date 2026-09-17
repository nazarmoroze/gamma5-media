import "server-only";

import nodemailer from "nodemailer";

// Sent through the studio's own Gmail account with an app password (Google Account → Security → App passwords).
const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");

export const briefRecipient = process.env.BRIEF_EMAIL_TO || "gamma5media@gmail.com";

const transport =
  user && pass
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
        // Fail fast instead of keeping the visitor waiting on a stuck connection.
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      })
    : null;

type Message = { to?: string; subject: string; html: string; text: string; replyTo?: string };

export async function sendMail({ to = briefRecipient, subject, html, text, replyTo }: Message) {
  if (!transport || !user) throw new Error("Email is not configured: set GMAIL_USER and GMAIL_APP_PASSWORD");
  await transport.sendMail({ from: { name: "GAMMA5 Website", address: user }, to, subject, html, text, replyTo });
}
