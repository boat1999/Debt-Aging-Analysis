import { Button, Dropdown } from 'antd';
import { DownloadOutlined, PrinterOutlined, FileExcelOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

interface ExportButtonProps {
  onExportExcel: () => void;
  onPrint: () => void;
}

export function ExportButton({ onExportExcel, onPrint }: ExportButtonProps) {
  const items: MenuProps['items'] = [
    { key: 'excel', label: 'Export Excel', icon: <FileExcelOutlined />, onClick: onExportExcel },
    { key: 'print', label: 'Print', icon: <PrinterOutlined />, onClick: onPrint },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button icon={<DownloadOutlined />} className="no-print">
        Export
      </Button>
    </Dropdown>
  );
}
