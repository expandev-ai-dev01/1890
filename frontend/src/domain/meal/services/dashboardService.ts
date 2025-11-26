import { authenticatedClient } from '@/core/lib/api';
import type { DashboardData, DashboardParams } from '../types/dashboard';

/**
 * @service DashboardService
 * @domain meal
 * @type REST
 */
export const dashboardService = {
  /**
   * Gets dashboard data for a specific date
   */
  async get(params: DashboardParams): Promise<DashboardData> {
    const response = await authenticatedClient.get<{ data: DashboardData }>('/dashboard', {
      params,
    });
    return response.data.data;
  },
};
