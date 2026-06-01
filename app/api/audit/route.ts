import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com.au",
  port: 587,
  secure: false,
  auth: {
    user: "admin@growvera.com.au",
    pass: process.env.ZOHO_SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, yourName, email, phone, suburb, businessType } = body;

    if (!businessName || !yourName || !email || !suburb || !businessType) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Notify Basem immediately
    await transporter.sendMail({
      from: '"GrowVera Leads" <admin@growvera.com.au>',
      to: "admin@growvera.com.au",
      subject: `🔥 New audit request — ${businessName} (${suburb})`,
      text: `NEW AUDIT REQUEST
━━━━━━━━━━━━━━━━━━━━━━
Business:      ${businessName}
Type:          ${businessType}
Suburb:        ${suburb}
Contact name:  ${yourName}
Email:         ${email}
Phone:         ${phone || "not provided"}
Submitted:     ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}
━━━━━━━━━━━━━━━━━━━━━━

REPLY TO THIS LEAD WITHIN 2 HOURS:
Reply to: ${email}

SUGGESTED REPLY:
---
Hi ${yourName},

Thanks for requesting your audit — I'll have it ready and sent to you within 24 hours.

Quick question while I put it together: what's the main thing you're hoping to improve — more calls, more Google visibility, or something else?

Basem
GrowVera
admin@growvera.com.au
---
`,
    });

    // Auto-confirm to the lead
    await transporter.sendMail({
      from: '"Basem from GrowVera" <admin@growvera.com.au>',
      to: email,
      subject: "Your free Google audit — GrowVera",
      text: `Hi ${yourName},

Got your request for ${businessName} — I'm on it.

I'll review your Google presence manually and send you a full audit report within 24 hours. It'll cover your current ranking, profile score, review velocity vs competitors, and the top 3 things to fix.

If you have any questions in the meantime, just reply to this email.

Basem
GrowVera
admin@growvera.com.au

To opt out reply 'unsubscribe'`,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[GrowVera] Audit form error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
