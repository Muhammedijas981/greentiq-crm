import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface DashboardStats {
  totalCustomers: number;
  activeLeads: number;
  contactedThisWeek: number;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', 'customers'], // Including 'customers' ensures mutations invalidating 'customers' also invalidate this
    queryFn: () => apiClient.getDashboardStats(),
    staleTime: 60 * 1000, // 1 minute
  });
}
