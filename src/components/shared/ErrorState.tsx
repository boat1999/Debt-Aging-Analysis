import { Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="py-8">
      <Alert
        type="error"
        message="ข้อผิดพลาด"
        description={message}
        showIcon
        action={
          onRetry ? (
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={onRetry}
            >
              ลองใหม่
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
