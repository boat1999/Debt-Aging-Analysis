import { Button, Space, Typography } from 'antd';
import { UserOutlined, LogoutOutlined, BankOutlined } from '@ant-design/icons';
import type { UserInfo as UserInfoType } from '../../types/session';

const { Text } = Typography;

interface UserInfoProps {
  userInfo: UserInfoType;
  onLogout: () => void;
}

export function UserInfo({ userInfo, onLogout }: UserInfoProps) {
  return (
    <Space size="middle">
      <Space size="small">
        <UserOutlined />
        <Text>{userInfo.fullname}</Text>
      </Space>
      <Space size="small">
        <BankOutlined />
        <Text type="secondary">{userInfo.hospital_name}</Text>
      </Space>
      <Button
        type="text"
        icon={<LogoutOutlined />}
        onClick={onLogout}
        size="small"
      >
        ออกจากระบบ
      </Button>
    </Space>
  );
}
