"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  Spinner,
} from "@phosphor-icons/react";

const BUSINESS_NAME_EXAMPLES = [
  "Sydney Smiles Dental",
  "Bondi Med Spa",
  "Sunrise NDIS Services",
  "Active Physio Parramatta",
  "Mitchell & Co. Law",
  "Clarity Accounting Group",
  "Rapid Plumbing Sydney",
  "Bright Beginnings Childcare",
];

function useRotatingPlaceholder(items: string[], interval = 2500) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items, interval]);
  return items[index];
}

const BUSINESS_TYPES = [
  "Dental Practice",
  "Med Spa / Aesthetics",
  "NDIS Provider",
  "Physiotherapy Clinic",
  "Law Firm",
  "Accounting Firm",
  "Trade (Plumbing / Electrical / etc.)",
  "Childcare",
  "Other",
];

interface FormData {
  businessName: string;
  yourName: string;
  email: string;
  phone: string;
  suburb: string;
  businessType: string;
  otherBusinessType: string;
}

const emptyForm: FormData = {
  businessName: "",
  yourName: "",
  email: "",
  phone: "",
  suburb: "",
  businessType: "",
  otherBusinessType: "",
};

type FormState = "idle" | "loading" | "success" | "error";

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p className="mt-1 text-xs" style={{ color: "#DC2626" }}>
      {message}
    </p>
  ) : null;
}

export default function AuditForm() {
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<FormState>("idle");

  function validate(): boolean {
    const newErrors: Partial<FormData> = {};
    if (!form.businessName.trim())
      newErrors.businessName = "Business name is required.";
    if (!form.yourName.trim()) newErrors.yourName = "Your name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!form.suburb.trim()) newErrors.suburb = "Suburb or area is required.";
    if (!form.businessType)
      newErrors.businessType = "Please select your business type.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "businessType" && value !== "Other" ? { otherBusinessType: "" } : {}),
    }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const businessNamePlaceholder = useRotatingPlaceholder(BUSINESS_NAME_EXAMPLES);

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200";
  const inputStyle = {
    background: "#fff",
    border: "1px solid rgba(13,13,11,0.12)",
    color: "#0D0D0B",
  };
  const focusStyle = {
    borderColor: "#1A5C3A",
    boxShadow: "0 0 0 3px rgba(26,92,58,0.12)",
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="flex flex-col items-center justify-center py-20 px-8 text-center rounded-3xl"
        style={{ background: "#E8F2EC" }}
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ background: "#1A5C3A" }}>
          <CheckCircle size={32} weight="fill" color="#fff" />
        </div>
        <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-outfit)", color: "#0D0D0B" }}>
          You&apos;re on the list.
        </h3>
        <p className="text-base leading-relaxed max-w-sm" style={{ color: "#6B6B67" }}>
          We&apos;ll review your Google presence and send your audit report
          within 24 hours. If you&apos;d like to move forward, we&apos;ll
          follow up with a custom plan and quote tailored to your business.
        </p>
        <div className="mt-8 px-5 py-3 rounded-full text-sm font-medium" style={{ background: "rgba(26,92,58,0.08)", color: "#1A5C3A" }}>
          Free, no obligation &middot; Results in 24 hours
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-5">
        {/* Row 1: Business Name + Your Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="businessName" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#6B6B67" }}>
              Business Name *
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              autoComplete="organization"
              placeholder={businessNamePlaceholder}
              value={form.businessName}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = errors.businessName ? "#DC2626" : "rgba(13,13,11,0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
            <FieldError message={errors.businessName} />
          </div>
          <div>
            <label htmlFor="yourName" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#6B6B67" }}>
              Your Name *
            </label>
            <input
              id="yourName"
              name="yourName"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={form.yourName}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = errors.yourName ? "#DC2626" : "rgba(13,13,11,0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
            <FieldError message={errors.yourName} />
          </div>
        </div>

        {/* Row 2: Email + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#6B6B67" }}>
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@yourbusiness.com.au"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = errors.email ? "#DC2626" : "rgba(13,13,11,0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
            <FieldError message={errors.email} />
          </div>
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#6B6B67" }}>
              Phone{" "}
              <span style={{ color: "rgba(107,107,103,0.6)" }}>(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="04xx xxx xxx"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(13,13,11,0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Row 3: Suburb + Business Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="suburb" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#6B6B67" }}>
              Suburb / Area *
            </label>
            <input
              id="suburb"
              name="suburb"
              type="text"
              placeholder="Surry Hills, Chatswood..."
              value={form.suburb}
              onChange={handleChange}
              className={inputClass}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = errors.suburb ? "#DC2626" : "rgba(13,13,11,0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
            <FieldError message={errors.suburb} />
          </div>
          <div>
            <label htmlFor="businessType" className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "#6B6B67" }}>
              Business Type *
            </label>
            <select
              id="businessType"
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
              className={inputClass}
              style={{
                ...inputStyle,
                cursor: "pointer",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%236B6B67' viewBox='0 0 256 256'%3E%3Cpath d='M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                paddingRight: "36px",
              }}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = errors.businessType ? "#DC2626" : "rgba(13,13,11,0.12)";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="" disabled>Select your industry...</option>
              {BUSINESS_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <FieldError message={errors.businessType} />
          </div>
        </div>

        {/* Other business type — smooth CSS reveal */}
        <div
          style={{
            maxHeight: form.businessType === "Other" ? "120px" : "0",
            opacity: form.businessType === "Other" ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.3s ease, opacity 0.3s ease",
          }}
        >
          <div>
            <label
              htmlFor="otherBusinessType"
              className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
              style={{ color: "#6B6B67" }}
            >
              Describe your business *
            </label>
            <input
              id="otherBusinessType"
              name="otherBusinessType"
              type="text"
              placeholder="e.g. Veterinary clinic, yoga studio…"
              value={form.otherBusinessType}
              onChange={handleChange}
              required={form.businessType === "Other"}
              className={inputClass}
              style={inputStyle}
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(13,13,11,0.12)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Error state */}
        <AnimatePresence>
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="px-4 py-3 rounded-xl text-sm"
              style={{ background: "#FEF2F2", color: "#DC2626" }}
            >
              Something went wrong. Please try again or email us at{" "}
              <a href="mailto:admin@growvera.com.au" className="font-semibold underline">
                admin@growvera.com.au
              </a>
              .
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-base font-semibold transition-all duration-200"
          style={{
            background: status === "loading" ? "#4A8A6A" : "#1A5C3A",
            color: "#fff",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            boxShadow: status === "loading" ? "none" : "0 4px 24px rgba(26,92,58,0.28)",
          }}
        >
          {status === "loading" ? (
            <><Spinner size={18} className="animate-spin" /><span>Sending your request...</span></>
          ) : (
            <><span>Get my free audit</span><ArrowRight size={18} weight="bold" /></>
          )}
        </button>

        <p className="text-center text-xs" style={{ color: "#6B6B67" }}>
          We&apos;ll respond within 24 hours &middot; Free, no obligation
        </p>
      </div>
    </form>
  );
}
