/**
 * @typedef {'N'|'NE'|'E'|'SE'|'S'|'SW'|'W'|'NW'} Dir8
 */

/**
 * @param {[number, number]} a
 * @param {[number, number]} b
 * @returns {Dir8}
 */
export function getDir(a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const angle = (Math.atan2(dx, dy) * 180) / Math.PI;
  const normalized = (angle + 360) % 360;
  const index = Math.round(normalized / 45) % 8;
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[index];
}
