import { DatePicker, Select, InputNumber, Button, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { FilterState } from '../../types/debt';
import { useTheme } from '../../contexts/ThemeContext';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface DashboardFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

function FilterGroup({ label, children, flex }: { label: string; children: React.ReactNode; flex?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: flex || 'none' }}>
      <label style={{
        fontSize: 11.5,
        fontWeight: 500,
        color: 'var(--gold)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function DashboardFilters({ filters, onChange, onReset }: DashboardFiltersProps) {
  const { isDark } = useTheme();

  const handleDateChange = (_: unknown, dateStrings: [string, string]) => {
    const [start, end] = dateStrings;
    onChange({ ...filters, dateRange: start && end ? [start, end] : null });
  };

  return (
    <Card
      className="no-print"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border-faint)',
        borderRadius: 16,
        marginBottom: 20,
        boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
        animation: 'fade-up .6s .02s cubic-bezier(.16,1,.3,1) forwards',
        opacity: 0,
      }}
      styles={{ body: { padding: '18px 24px' } }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end' }}>
        <FilterGroup label="วันที่หนี้">
          <RangePicker
            value={filters.dateRange ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])] : null}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            size="middle"
          />
        </FilterGroup>

        <FilterGroup label="สถานะ AR">
          <Select
            value={filters.arStatus}
            onChange={(value) => onChange({ ...filters, arStatus: value })}
            style={{ width: 140 }}
            size="middle"
            options={[
              { label: 'ทั้งหมด', value: 'all' },
              { label: 'โอนแล้ว', value: 'transferred' },
              { label: 'ยังไม่โอน', value: 'pending' },
            ]}
          />
        </FilterGroup>

        <FilterGroup label="แผนก">
          <Select
            value={filters.department}
            onChange={(value) => onChange({ ...filters, department: value })}
            style={{ width: 120 }}
            size="middle"
            options={[
              { label: 'ทั้งหมด', value: 'all' },
              { label: 'OPD', value: 'OPD' },
              { label: 'IPD', value: 'IPD' },
            ]}
          />
        </FilterGroup>

        <FilterGroup label="ยอดขั้นต่ำ">
          <InputNumber
            value={filters.minAmount}
            onChange={(value) => onChange({ ...filters, minAmount: value })}
            placeholder="0"
            size="middle"
            style={{ width: 130 }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </FilterGroup>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <Button type="primary" icon={<SearchOutlined />} size="middle" onClick={() => onChange(filters)}>
            ค้นหา
          </Button>
          <Button ghost icon={<ReloadOutlined />} size="middle" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
