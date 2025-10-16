export const DISCHARGE_POINT_MAX = 20;

const padPoint = (index: number) => index.toString().padStart(2, '0');

export const buildDischargePointName = (index: number) => `DP-${padPoint(index)}`;

export const normalizeDischargePointName = (raw: unknown): string => {
  if (raw === undefined || raw === null) return '';
  const text = String(raw).trim();
  if (!text) return '';

  const normalized = text.toUpperCase();

  const explicitMatch = normalized.match(/^DP[\s_-]?(\d{1,2})$/);
  if (explicitMatch) {
    const candidate = Number(explicitMatch[1]);
    if (Number.isFinite(candidate) && candidate >= 1 && candidate <= DISCHARGE_POINT_MAX) {
      return buildDischargePointName(candidate);
    }
  }

  const numericMatch = normalized.match(/^(\d{1,2})$/);
  if (numericMatch) {
    const candidate = Number(numericMatch[1]);
    if (Number.isFinite(candidate) && candidate >= 1 && candidate <= DISCHARGE_POINT_MAX) {
      return buildDischargePointName(candidate);
    }
  }

  const prefixed = normalized.match(/^DP-(\d{2})$/);
  if (prefixed) {
    const candidate = Number(prefixed[1]);
    if (Number.isFinite(candidate) && candidate >= 1 && candidate <= DISCHARGE_POINT_MAX) {
      return buildDischargePointName(candidate);
    }
  }

  return text;
};

export const DISCHARGE_POINT_OPTIONS = Array.from({ length: DISCHARGE_POINT_MAX }, (_, idx) => ({
  index: idx + 1,
  name: buildDischargePointName(idx + 1),
}));
