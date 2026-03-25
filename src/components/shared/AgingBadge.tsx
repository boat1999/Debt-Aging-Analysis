import { Tag } from 'antd';
import { getAgingColor, calculateAgingBucket, getAgingLabel } from '../../utils/aging';

interface AgingBadgeProps {
  days: number;
  showLabel?: boolean;
}

export function AgingBadge({ days, showLabel = false }: AgingBadgeProps) {
  const color = getAgingColor(days);
  const bucket = calculateAgingBucket(days);
  const label = showLabel ? getAgingLabel(bucket) : `${days} วัน`;

  return <Tag color={color}>{label}</Tag>;
}
