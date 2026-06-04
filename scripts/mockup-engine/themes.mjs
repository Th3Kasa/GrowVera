/**
 * Trade theme presets.
 * Each niche maps to an accent colour system + a curated, license-free hero image
 * + a sensible default service list (Claude rewrites these in the owner's voice,
 * but we always have a real fallback so a mock-up never ships empty).
 *
 * Hero images are Unsplash (free license). Override per-client with --heroImage=URL.
 */

export const THEMES = {
  plumber: {
    label: "Plumbing",
    accent: "#1F6FEB",
    accentDark: "#1450A8",
    accentSoft: "#E8F0FE",
    hero: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=1600&q=80",
    heroPrompt: "cinematic editorial photograph of a professional plumber in clean uniform working on modern copper pipes, dramatic warm side lighting, shallow depth of field, dark moody industrial background, premium commercial photography, high detail",
    services: ["Emergency Repairs", "Blocked Drains", "Hot Water Systems", "Leak Detection", "Bathroom Renovations", "Gas Fitting"],
    emergency: true,
  },
  electrician: {
    label: "Electrical",
    accent: "#E8A317",
    accentDark: "#B97E0C",
    accentSoft: "#FBF1DC",
    hero: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1600&q=80",
    heroPrompt: "cinematic editorial photograph of a professional electrician working on a switchboard, dramatic warm rim lighting, sparks of detail, dark moody background, shallow depth of field, premium commercial photography, high detail",
    services: ["Switchboard Upgrades", "Lighting Installation", "Power Points", "Safety Inspections", "Smoke Alarms", "Fault Finding"],
    emergency: true,
  },
  landscaper: {
    label: "Landscaping",
    accent: "#2E8B57",
    accentDark: "#206B41",
    accentSoft: "#E6F2EB",
    hero: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1600&q=80",
    heroPrompt: "cinematic editorial photograph of a beautifully landscaped modern garden at golden hour, lush greenery and stone paving, warm side lighting, shallow depth of field, premium commercial photography, high detail",
    services: ["Garden Design", "Turf & Lawns", "Retaining Walls", "Paving", "Irrigation", "Garden Maintenance"],
    emergency: false,
  },
  builder: {
    label: "Building & Construction",
    accent: "#D9622B",
    accentDark: "#AB4A1F",
    accentSoft: "#FBEBE2",
    hero: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    heroPrompt: "cinematic editorial photograph of a builder reviewing plans on a modern construction site at golden hour, timber framing, warm dramatic lighting, shallow depth of field, premium commercial photography, high detail",
    services: ["Home Extensions", "Renovations", "New Builds", "Decks & Pergolas", "Bathrooms", "Project Management"],
    emergency: false,
  },
  painter: {
    label: "Painting",
    accent: "#6D4AC2",
    accentDark: "#523592",
    accentSoft: "#EEE9F8",
    hero: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1600&q=80",
    heroPrompt: "cinematic editorial photograph of a professional painter rolling a wall in a bright modern interior, crisp clean finish, warm natural lighting, shallow depth of field, premium commercial photography, high detail",
    services: ["Interior Painting", "Exterior Painting", "Roof Painting", "Feature Walls", "Commercial Painting", "Colour Consulting"],
    emergency: false,
  },
  cleaner: {
    label: "Cleaning",
    accent: "#0E9488",
    accentDark: "#0A6E66",
    accentSoft: "#E0F2F0",
    hero: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",
    heroPrompt: "cinematic editorial photograph of a spotless bright modern living space being professionally cleaned, fresh and crisp, warm natural lighting, shallow depth of field, premium commercial photography, high detail",
    services: ["End of Lease Cleans", "Regular House Cleaning", "Commercial Cleaning", "Carpet Cleaning", "Window Cleaning", "Spring Cleans"],
    emergency: false,
  },
  // Generic fallback for any unmatched trade.
  default: {
    label: "Local Services",
    accent: "#1A5C3A",
    accentDark: "#124027",
    accentSoft: "#E8F2EC",
    hero: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    heroPrompt: "cinematic editorial photograph of a professional local tradesperson at work, dramatic warm lighting, dark moody background, shallow depth of field, premium commercial photography, high detail",
    services: ["Free Quotes", "Quality Workmanship", "Fully Licensed", "On-Time Service", "Local & Trusted", "Satisfaction Guaranteed"],
    emergency: false,
  },
};

/** Map a free-text niche string to a theme key. */
export function resolveTheme(niche = "") {
  const n = niche.toLowerCase();
  if (/plumb/.test(n)) return "plumber";
  if (/electric|sparky/.test(n)) return "electrician";
  if (/landscap|garden|lawn/.test(n)) return "landscaper";
  if (/build|construct|carpent|renovat/.test(n)) return "builder";
  if (/paint/.test(n)) return "painter";
  if (/clean/.test(n)) return "cleaner";
  return "default";
}
