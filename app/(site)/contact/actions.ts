"use server";

import { Resend } from "resend";
import { getSettings } from "@/lib/queries";

export interface ContactState {
  ok: boolean;
  error?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  // Honeypot — bots fill this hidden field; humans don't.
  const honey = String(formData.get("company") ?? "");

  if (honey) return { ok: true }; // silently drop spam
  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { ok: false, error: "Please enter a valid email address." };
  if (message.length < 5)
    return { ok: false, error: "Please write a longer message." };
  if (message.length > 5000)
    return { ok: false, error: "Message is too long." };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "Email sending is not configured." };

  const settings = await getSettings();
  const to = process.env.CONTACT_TO_EMAIL || settings.contact_email;
  if (!to) return { ok: false, error: "No destination email is configured." };

  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `${settings.site_title} <${from}>`,
      to,
      replyTo: email,
      subject: `New contact message from ${name}`,
      html: `
        <h2>New message from ${settings.site_title}</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      `,
    });

    if (error) return { ok: false, error: "Could not send your message. Please try again later." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not send your message. Please try again later." };
  }
}
