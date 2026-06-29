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
  source: "google_places" | "sample";
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
  | "lapsed";

export interface Lead {
  business: Business;
  status: LeadStatus;
  site?: { slug: string; path?: string; url?: string };
  review?: ReviewResult;
  pitch?: string;
  touches: number;
  createdAt: string;
  updatedAt: string;
}
