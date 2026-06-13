import type { Business } from "./types";
import { stableId } from "./util";

/**
 * Offline sample prospects — used when GOOGLE_PLACES_API_KEY is not set so the
 * whole pipeline runs end-to-end with no external dependencies. Photos are
 * deterministic placeholders that resolve when online.
 */
function photo(seed: string): string {
  return `https://picsum.photos/seed/${seed}/1200/800`;
}

const raw: Omit<Business, "id" | "score">[] = [
  {
    name: "Coastline Plumbing Co.",
    category: "Plumber",
    region: "Cronulla NSW",
    address: "12 Kingsway, Cronulla NSW 2230",
    phone: "(02) 9523 1100",
    website: null,
    rating: 4.8,
    reviewsCount: 96,
    hours: "Mon–Sat 7am–5pm",
    photos: [photo("coastline-1"), photo("coastline-2"), photo("coastline-3")],
    source: "sample",
  },
  {
    name: "Ridgeway Electrical",
    category: "Electrician",
    region: "Penrith NSW",
    address: "3 Henry St, Penrith NSW 2750",
    phone: "(02) 4721 8800",
    website: null,
    rating: 4.6,
    reviewsCount: 54,
    hours: "Mon–Fri 7am–4pm",
    photos: [photo("ridgeway-1"), photo("ridgeway-2")],
    source: "sample",
  },
  {
    name: "Apex Auto Care",
    category: "Auto repair",
    region: "Parramatta NSW",
    address: "88 Church St, Parramatta NSW 2150",
    phone: "(02) 9630 4422",
    website: null,
    rating: 4.9,
    reviewsCount: 211,
    hours: "Mon–Sat 8am–5:30pm",
    photos: [photo("apex-1"), photo("apex-2"), photo("apex-3")],
    source: "sample",
  },
  {
    name: "Summit Roofing",
    category: "Roofer",
    region: "Newcastle NSW",
    address: "5 Maitland Rd, Mayfield NSW 2304",
    phone: "(02) 4023 7711",
    website: null,
    rating: 4.7,
    reviewsCount: 38,
    hours: "Mon–Fri 6:30am–4pm",
    photos: [photo("summit-1"), photo("summit-2")],
    source: "sample",
  },
  {
    name: "Greenline Landscaping",
    category: "Landscaper",
    region: "Wollongong NSW",
    address: "21 Crown St, Wollongong NSW 2500",
    phone: "(02) 4225 6600",
    website: null,
    rating: 4.5,
    reviewsCount: 27,
    hours: "Mon–Sat 7am–5pm",
    photos: [photo("greenline-1"), photo("greenline-2")],
    source: "sample",
  },
];

export const SAMPLE_BUSINESSES: Business[] = raw.map((b) => ({
  ...b,
  id: stableId(b.name, b.address ?? ""),
}));
