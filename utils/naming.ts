export const canonicalizeDischargePointName = (value: unknown): string => {
  if (value === undefined || value === null) return '';
  const raw = String(value).trim();
  if (!raw) return '';
  const normalized = raw.toUpperCase().replace(/\s+/g, '');

  const dpMatch = normalized.match(/^DP[-_#]?0*(\d{1,3})$/);
  const bareNumberMatch = normalized.match(/^0*(\d{1,3})$/);
  const genericMatch = normalized.match(/^DP(?:POINT)?[-_#]?0*(\d{1,3})$/);

  let num: number | null = null;
  if (dpMatch) {
    num = Number(dpMatch[1]);
  } else if (genericMatch) {
    num = Number(genericMatch[1]);
  } else if (bareNumberMatch) {
    num = Number(bareNumberMatch[1]);
  }

  if (num && num > 0) {
    return `DP-${String(num).padStart(2, '0')}`;
  }

  return raw;
};
