/**
 * Format jumlah bintang untuk display
 */
export function formatStars(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
}

/**
 * Clamp nilai star antara 1–3
 */
export function clampStars(stars: number): 1 | 2 | 3 {
  if (stars <= 1) return 1;
  if (stars >= 3) return 3;
  return 2;
}
