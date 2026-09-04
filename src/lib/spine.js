/**
 * The spine is the one bold thing in this design: every book carries a narrow
 * band of binding cloth, dyed from its title so the same book keeps the same
 * colour in the grid, in the shelf on the home page, and on its own page.
 */
const SPINES = 8;

/** FNV-1a, so the colour is stable across reloads and across machines. */
function hash(seed) {
  let value = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    value ^= seed.charCodeAt(i);
    value = Math.imul(value, 0x01000193);
  }
  return value >>> 0;
}

export function spineColor(seed = '') {
  return `var(--spine-${(hash(seed) % SPINES) + 1})`;
}

/**
 * Cloth was woven in a handful of widths. Varying the band by a second slice of
 * the same hash gives a shelf the uneven rhythm real books have.
 */
export function spineWidth(seed = '', min = 18, max = 46) {
  const span = max - min;
  return min + ((hash(seed) >>> 8) % span);
}

/** Books on a real shelf are not the same height; this varies them by 0-1. */
export function spineHeight(seed = '') {
  return ((hash(seed) >>> 16) % 100) / 100;
}
