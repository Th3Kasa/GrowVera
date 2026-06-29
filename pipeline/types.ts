export interface Business {
  id: string; // stable id derived from name + address
  name: string;
  category: string;
  region: string;
  address?: string;
  phone?: string;
  website?: string | null; // empty/null = the opportunity
  rating?: number;
  reviewsCount?: number;
  hours?: string;
  photos: string[]; // public photo URLs (or local paths)
  source: "google_places" | "sample" | "signal";
  score?: number; // 0–100 opportunity score
}

export interface SiteArtifact {
  businessId: string;
  slug: string;
  html: string;
  path?: string; // local deploy path
  url?: string; // live/preview URL
  generatedBy: "ai" | "template";
}

export interface ReviewResult {
  passed: boolean;
  score: number; // 0–100
  issues: string[];
  summary: string;
  reviewedBy: "ai" | "skipped";
}

export type LeadStatus =
  | "found"
  | "gathered"
  | "built"
  | "reviewing"
  | "ready"
  | "pitched"
  | "replied"
  | "booked"
  | "won"
  | "lost"
  | "suppressed"
  | "lapsed";

/** Outreach channels the engine can use. */
export type Channel = "email" | "instagram" | "facebook" | "sms" | "phone" | "linkedin";

export interface Lead {
  business: Business;
  status: LeadStatus;
  site?: { slug: string; path?: string; url?: string };
  review?: ReviewResult;
  pitch?: string;
  /** Intent quote + source link that warmed this lead (from the signal scout). */
  signal?: string;
  /** Public /offer/[id] page URL shown to the prospect (demo + prices + book). */
  offerUrl?: string;
  /** Channel the outreach was sent on, and which template variant. */
  channel?: Channel;
  variant?: string;
  sentAt?: string;
  repliedAt?: string;
  bookedAt?: string;
  touches: number;
  createdAt: string;
  updatedAt: string;
}

/** The CRM surface shared by the JSON and Airtable backends. */
export interface LeadStore {
  init(): Promise<void>;
  has(id: string): boolean;
  add(business: Business): boolean;
  update(id: string, patch: Partial<Omit<Lead, "business" | "createdAt">>): void;
  setStatus(id: string, status: LeadStatus): void;
  get(id: string): Lead | undefined;
  byStatus(status: LeadStatus): Lead[];
  markLapsed(olderThanDays?: number): number;
  all(): Lead[];
  save(): Promise<void>;
}
