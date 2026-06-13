import type { Business } from "./types";

/**
 * Ensures each prospect has the assets the builder needs. The prospector already
 * pulls photos/hours from Places in the same call, so this mostly normalises and
 * guarantees at least one usable image. Extend here to download/cache photos,
 * fetch reviews, or enrich from additional public sources.
 */
export function gather(business: Business): Business {
  const photos = business.photos.filter(Boolean);
  if (photos.length === 0) {
    photos.push(`https://picsum.photos/seed/${business.id}/1200/800`);
  }
  return { ...business, photos };
}
