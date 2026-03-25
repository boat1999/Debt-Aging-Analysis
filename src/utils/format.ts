export function formatMoney(value: number | null | undefined): string {
  const num = value ?? 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatNumber(value: number | null | undefined): string {
  const num = value ?? 0;
  return num.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  });
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '-';
  const parts = value.split('-');
  if (parts.length !== 3) return value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}
