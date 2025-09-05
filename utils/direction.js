/**
 * @typedef {'N'|'NE'|'E'|'SE'|'S'|'SW'|'W'|'NW'} Dir8
 */

/**
 * Compute bearing from point a to b and snap to 8 compass directions.
 * 0° represents North and angles increase clockwise.
 * @param {[number,number]} a
 * @param {[number,number]} b
 * @returns {Dir8}
 */
export function getDir(a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const angle = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(angle / 45) % 8;
  return dirs[idx];
}
