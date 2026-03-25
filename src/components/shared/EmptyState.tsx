import { Empty } from 'antd';

interface EmptyStateProps {
  description?: string;
}

export function EmptyState({ description = 'ไม่พบข้อมูล' }: EmptyStateProps) {
  return (
    <div className="py-12">
      <Empty description={description} />
    </div>
  );
}
