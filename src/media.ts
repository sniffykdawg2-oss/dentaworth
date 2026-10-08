/**
 * Every local photo in public/images has an optimized .webp sibling
 * (generated with cwebp, max 1600px wide). Content files keep referencing the
 * original paths; render through this helper to serve the lighter copy.
 */
export function toWebp(src: string) {
  if (!src.startsWith("/images/")) return src;
  return src.replace(/\.(png|jpe?g)$/i, ".webp");
}
