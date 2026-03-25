import { Spin } from 'antd';

interface LoadingStateProps {
  tip?: string;
}

export function LoadingState({ tip = 'กำลังโหลดข้อมูล...' }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <Spin size="large" tip={tip}>
        <div className="p-12" />
      </Spin>
    </div>
  );
}
