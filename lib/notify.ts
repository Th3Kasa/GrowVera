/**
 * Founder notifications via Zoho SMTP (already used for the lead form). Graceful:
 * if ZOHO_SMTP_PASS isn't set it logs instead, so flows never crash in dev.
 *
 * Env: ZOHO_SMTP_PASS (required to actually send). Optional overrides:
 *   ZOHO_SMTP_HOST (default smtp.zoho.com.au), ZOHO_SMTP_PORT (465),
 *   ZOHO_SMTP_USER / NOTIFY_FROM (default admin@growvera.com.au),
 *   NOTIFY_TO (default admin@growvera.com.au).
 */
import nodemailer from "nodemailer";

function sender(): string {
  return process.env.ZOHO_SMTP_USER || process.env.NOTIFY_FROM || "admin@growvera.com.au";
}

/**
 * Send an email via Zoho SMTP. Returns true if actually sent. No-ops (returns
 * false) when ZOHO_SMTP_PASS isn't set so flows never crash in dev.
 */
export async function sendEmail(to: string, subject: string, text: string): Promise<boolean> {
  const pass = process.env.ZOHO_SMTP_PASS;
  const user = sender();

  if (!pass) {
    console.log(`[notify] (no SMTP configured) → ${to}: ${subject}`);
    return false;
  }

  try {
    const transport = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com.au",
      port: Number(process.env.ZOHO_SMTP_PORT || 465),
      secure: true,
      auth: { user, pass },
    });
    await transport.sendMail({ from: `GrowVera <${user}>`, to, subject, text });
    return true;
  } catch (err) {
    console.error("[notify] send failed:", err);
    return false;
  }
}

/** Notify the founder (internal alerts: bookings, run summaries). */
export async function notifyFounder(subject: string, text: string): Promise<void> {
  const to = process.env.NOTIFY_TO || "contact.basemmorkos@gmail.com";
  await sendEmail(to, subject, text);
}
