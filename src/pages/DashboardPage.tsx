import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'antd';
import { useAgingSummary } from '../hooks/useAgingSummary';
import { useAlertSummary } from '../hooks/useAlertSummary';
import { useTrendData } from '../hooks/useTrendData';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { KpiCardsSkeleton } from '../components/dashboard/KpiCardsSkeleton';
import { AgingTable } from '../components/dashboard/AgingTable';
import { AgingTableSkeleton } from '../components/dashboard/AgingTableSkeleton';
import { AlertPanel } from '../components/dashboard/AlertPanel';
import { AgingBarChart } from '../components/dashboard/AgingBarChart';
import { PttypePieChart } from '../components/dashboard/PttypePieChart';
import { TrendLineChart } from '../components/dashboard/TrendLineChart';
import { ChartsSkeleton } from '../components/dashboard/ChartsSkeleton';
import { DashboardFilters } from '../components/dashboard/DashboardFilters';
import { ExportButton } from '../components/shared/ExportButton';
import { ErrorState } from '../components/shared/ErrorState';
import { exportAgingSummaryToExcel, triggerPrint } from '../utils/export';
import type { SessionConfig } from '../types/session';
import type { FilterState } from '../types/debt';
import { DEFAULT_FILTERS } from '../types/debt';

interface DashboardPageProps {
  sessionConfig: SessionConfig;
}

export function DashboardPage({ sessionConfig }: DashboardPageProps) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const aging = useAgingSummary(sessionConfig, filters);
  const alerts = useAlertSummary(sessionConfig, filters);
  const trend = useTrendData(sessionConfig, filters);

  if (aging.error) {
    return <ErrorState message={aging.error.message} onRetry={() => aging.refetch()} />;
  }

  const showAgingSkeleton = aging.isLoading || aging.isFetching;
  const showChartSkeleton = aging.isLoading || trend.isLoading;

  return (
    <div>
      {aging.isLoading ? <KpiCardsSkeleton /> : <SummaryCards data={aging.data} isLoading={false} />}

      <DashboardFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <AlertPanel data={alerts.data} isLoading={alerts.isLoading} />

      {showAgingSkeleton
        ? <AgingTableSkeleton />
        : <AgingTable data={aging.data} isLoading={false} onRowClick={(pttype) => navigate(`/detail/${pttype}`)} />
      }

      {showChartSkeleton ? (
        <ChartsSkeleton />
      ) : (
        <>
          <Row gutter={[14, 14]}>
            <Col xs={24} lg={12}>
              <AgingBarChart data={aging.data} />
            </Col>
            <Col xs={24} lg={12}>
              <PttypePieChart data={aging.data} />
            </Col>
          </Row>
          <TrendLineChart data={trend.data} />
        </>
      )}

      <div className="flex justify-end mt-2 no-print">
        <ExportButton
          onExportExcel={() => {
            if (aging.data) exportAgingSummaryToExcel(aging.data);
          }}
          onPrint={triggerPrint}
        />
      </div>
    </div>
  );
}
