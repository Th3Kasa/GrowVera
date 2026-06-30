import { hasGooglePlaces } from "./config";
import { SAMPLE_BUSINESSES } from "./sampleData";
import { clamp, stableId } from "./util";
import type { Business } from "./types";

/** Demand weighting by category — high-ticket trades convert best. */
const DEMAND: Record<string, number> = {
  plumber: 15,
  electrician: 14,
  roofer: 15,
  "auto repair": 12,
  hvac: 14,
  builder: 13,
  landscaper: 10,
  cleaner: 8,
};

function scoreBusiness(b: Business): number {
  let s = 50; // baseline: no website = real opportunity
  if (b.phone) s += 8;
  if (typeof b.rating === "number") s += clamp((b.rating - 3.5) * 14, 0, 18);
  if (b.reviewsCount) s += clamp(Math.log10(b.reviewsCount + 1) * 7, 0, 14);
  s += DEMAND[b.category.toLowerCase()] ?? 6;
  return Math.round(clamp(s));
}

/**
 * A business "has a website" for our purposes only if it's a real, owned domain.
 * A Facebook/Instagram/linktr.ee/free-builder page is exactly GrowVera's ideal
 * prospect — they've tried to be online and it looks cheap — so those count as
 * NO real website and stay in the funnel. Google Places also ranks properly-
 * websited businesses first, so without this nearly every top result in a metro
 * suburb gets filtered out and prospecting returns nothing.
 */
const NON_WEBSITE_HOSTS = [
  "facebook.com",
  "fb.com",
  "instagram.com",
  "linktr.ee",
  "linktree.com",
  "tiktok.com",
  "twitter.com",
  "x.com",
  "youtube.com",
  "yelp.com",
  "yellowpages.com",
  "google.com",
  "g.page",
  "business.site", // Google's free "Business Profile" site builder
  "wixsite.com",
  "godaddysites.com",
  "weebly.com",
  "wordpress.com",
  "blogspot.com",
  "myob.com",
  "hotfrog.com",
  "truelocal.com",
];

function hasRealWebsite(uri?: string): boolean {
  if (!uri) return false;
  let host: string;
  try {
    host = new URL(uri).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return false; // unparseable → treat as no real site, keep them as a lead
  }
  return !NON_WEBSITE_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

interface PlacesSearchResponse {
  places?: Array<{
    id: string;
    displayName?: { text: string };
    formattedAddress?: string;
    nationalPhoneNumber?: string;
    websiteUri?: string;
    rating?: number;
    userRatingCount?: number;
    primaryTypeDisplayName?: { text: string };
    photos?: Array<{ name: string }>;
    regularOpeningHours?: { weekdayDescriptions?: string[] };
  }>;
}

async function fromGooglePlaces(region: string, category: string, limit: number): Promise<Business[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY as string;
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.primaryTypeDisplayName,places.photos,places.regularOpeningHours",
    },
    // Always pull a full pool (Places caps at 20), not limit*3 — most listed
    // trades already have a website and get filtered out below, so a small limit
    // (e.g. 1) would otherwise leave zero survivors. We slice to `limit` after
    // the no-website filter, in prospect().
    body: JSON.stringify({ textQuery: `${category} in ${region}`, maxResultCount: 20 }),
  });

  if (!res.ok) {
    throw new Error(`Places API ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as PlacesSearchResponse;
  const out: Business[] = [];

  for (const p of data.places ?? []) {
    if (hasRealWebsite(p.websiteUri)) continue; // real owned domain — not a prospect
    const name = p.displayName?.text ?? "Unknown business";
    const address = p.formattedAddress ?? "";
    // Proxy through our own API route — never embed GOOGLE_PLACES_API_KEY in a
    // URL that ends up in publicly served HTML (it would leak the live key).
    const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || "https://growvera.com.au").replace(/\/$/, "");
    const photos = (p.photos ?? [])
      .slice(0, 3)
      .map((ph) => `${siteBase}/api/places-photo?name=${encodeURIComponent(ph.name)}&w=1200`);
    out.push({
      id: stableId(name, address),
      name,
      category,
      region,
      address,
      phone: p.nationalPhoneNumber,
      website: null,
      rating: p.rating,
      reviewsCount: p.userRatingCount,
      hours: p.regularOpeningHours?.weekdayDescriptions?.join(" · "),
      photos,
      source: "google_places",
    });
  }
  return out;
}

/**
 * Find businesses with no website in a region, score them, and return the
 * strongest first. Falls back to bundled sample data when no Places key is set.
 */
export async function prospect(region: string, category: string, limit = 5): Promise<Business[]> {
  let found: Business[];
  if (hasGooglePlaces()) {
    found = await fromGooglePlaces(region, category, limit);
  } else {
    found = SAMPLE_BUSINESSES.filter(
      (b) =>
        (category === "*" || b.category.toLowerCase() === category.toLowerCase()) &&
        (region === "*" || b.region.toLowerCase().includes(region.toLowerCase())),
    );
    if (found.length === 0) found = SAMPLE_BUSINESSES; // ensure the demo always has prospects
  }

  return found
    .map((b) => ({ ...b, score: scoreBusiness(b) }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, limit);
}
