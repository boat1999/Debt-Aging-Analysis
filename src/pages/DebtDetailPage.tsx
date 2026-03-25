import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useDebtDetail } from '../hooks/useDebtDetail';
import { DebtTable } from '../components/detail/DebtTable';
import { DetailFilters } from '../components/detail/DetailFilters';
import { ErrorState } from '../components/shared/ErrorState';
import { ExportButton } from '../components/shared/ExportButton';
import { exportDetailToExcel, triggerPrint } from '../utils/export';
import type { SessionConfig } from '../types/session';
import type { FilterState } from '../types/debt';
import { DEFAULT_FILTERS } from '../types/debt';

const { Title } = Typography;

interface DebtDetailPageProps {
  sessionConfig: SessionConfig;
}

export function DebtDetailPage({ sessionConfig }: DebtDetailPageProps) {
  const { pttype } = useParams<{ pttype: string }>();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const { data, isLoading, error, refetch } = useDebtDetail(
    sessionConfig,
    pttype ?? '',
    filters,
  );

  if (error) {
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  }

  return (
    <div>
      <Space className="mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
          กลับหน้าหลัก
        </Button>
        <Title level={4} className="mb-0">
          รายละเอียดหนี้: สิทธิ {pttype}
        </Title>
      </Space>

      <DetailFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <DebtTable data={data} isLoading={isLoading} />

      <div className="flex justify-end mt-4 no-print">
        <ExportButton
          onExportExcel={() => {
            if (data) exportDetailToExcel(data, `debt-detail-${pttype}.xlsx`);
          }}
          onPrint={triggerPrint}
        />
      </div>
    </div>
  );
}
