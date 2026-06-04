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
    const { businessName, yourName, email, phone, suburb, businessType, otherBusinessType } = body;

    if (!businessName || !yourName || !email || !suburb || !businessType) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const resolvedBusinessType = businessType === "Other" && otherBusinessType
      ? `Other: ${otherBusinessType}`
      : businessType;

    await transporter.sendMail({
      from: '"GrowVera Leads" <admin@growvera.com.au>',
      to: "admin@growvera.com.au",
      subject: `🔥 New audit request — ${businessName} (${suburb})`,
      text: `NEW AUDIT REQUEST\n━━━━━━━━━━━━━━━━━━━━━━\nBusiness:      ${businessName}\nType:          ${resolvedBusinessType}\nSuburb:        ${suburb}\nContact name:  ${yourName}\nEmail:         ${email}\nPhone:         ${phone || "not provided"}\nSubmitted:     ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}\n━━━━━━━━━━━━━━━━━━━━━━\n\nREPLY TO THIS LEAD WITHIN 2 HOURS:\nReply to: ${email}\n`,
    });

    await transporter.sendMail({
      from: '"Basem from GrowVera" <admin@growvera.com.au>',
      to: email,
      subject: "Your free Google audit — GrowVera",
      text: `Hi ${yourName},\n\nGot your request for ${businessName} — I'm on it.\n\nI'll review your Google presence manually and send you a full audit report within 24 hours.\n\nBasem\nGrowVera\nadmin@growvera.com.au\n\nTo opt out reply 'unsubscribe'`,
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[GrowVera] Audit form error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
