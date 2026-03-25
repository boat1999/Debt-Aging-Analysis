import type { CSSProperties } from 'react';
import { formatMoney } from '../../utils/format';

interface MoneyCellProps {
  value: number | null | undefined;
  className?: string;
  style?: CSSProperties;
}

export function MoneyCell({ value, className = '', style }: MoneyCellProps) {
  return (
    <span
      className={`inline-block w-full text-right ${className}`}
      style={{ textAlign: 'right', fontSize: 12, fontFamily: "'Outfit', sans-serif", ...style }}
    >
      {formatMoney(value)}
    </span>
  );
}
