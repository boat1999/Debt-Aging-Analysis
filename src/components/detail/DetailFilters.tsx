import { Form, DatePicker, Select, Input, Button, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { FilterState } from '../../types/debt';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface DetailFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function DetailFilters({ filters, onChange, onReset }: DetailFiltersProps) {
  const handleDateChange = (_: unknown, dateStrings: [string, string]) => {
    const [start, end] = dateStrings;
    onChange({ ...filters, dateRange: start && end ? [start, end] : null });
  };

  return (
    <Card className="mb-4 no-print">
      <Form layout="inline" className="flex flex-wrap gap-2">
        <Form.Item label="วันที่">
          <RangePicker
            value={filters.dateRange ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])] : null}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
          />
        </Form.Item>
        <Form.Item label="สถานะ AR">
          <Select
            value={filters.arStatus}
            onChange={(value) => onChange({ ...filters, arStatus: value })}
            style={{ width: 140 }}
            options={[
              { label: 'ทั้งหมด', value: 'all' },
              { label: 'โอนแล้ว', value: 'transferred' },
              { label: 'ยังไม่โอน', value: 'pending' },
            ]}
          />
        </Form.Item>
        <Form.Item label="แผนก">
          <Select
            value={filters.department}
            onChange={(value) => onChange({ ...filters, department: value })}
            style={{ width: 120 }}
            options={[
              { label: 'ทั้งหมด', value: 'all' },
              { label: 'OPD', value: 'OPD' },
              { label: 'IPD', value: 'IPD' },
            ]}
          />
        </Form.Item>
        <Form.Item label="ค้นหา">
          <Input
            placeholder="HN / ชื่อ"
            value={filters.searchText}
            onChange={(e) => onChange({ ...filters, searchText: e.target.value })}
            prefix={<SearchOutlined />}
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" icon={<SearchOutlined />}>ค้นหา</Button>
            <Button icon={<ReloadOutlined />} onClick={onReset}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
