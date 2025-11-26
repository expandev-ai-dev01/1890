import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardParams } from '../../types/dashboard';

export const useDashboard = (params: DashboardParams) => {
  const queryKey = ['dashboard', params];

  const { data, ...queryInfo } = useQuery({
    queryKey,
    queryFn: () => dashboardService.get(params),
  });

  return { data, ...queryInfo };
};
