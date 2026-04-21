export function minifySql(sql: string): string {
  return sql.replace(/\s+/g, ' ').trim();
}

export function escapeSqlString(value: string): string {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "''");
}

export function escapeLikePattern(value: string): string {
  return escapeSqlString(value).replace(/%/g, '\\%').replace(/_/g, '\\_');
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateIsoDate(value: unknown): string | null {
  if (typeof value !== 'string' || !ISO_DATE_RE.test(value)) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : value;
}

export function toFiniteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

const PTTYPE_CODE_RE = /^[A-Za-z0-9_]{1,20}$/;

export function validatePttypeCode(value: unknown): string | null {
  return typeof value === 'string' && PTTYPE_CODE_RE.test(value) ? value : null;
}
