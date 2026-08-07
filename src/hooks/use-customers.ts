import { useQuery } from '@tanstack/react-query';
import { apiClient, GetCustomersParams } from '@/lib/api-client';

export function useCustomers(params: GetCustomersParams) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => apiClient.getCustomers(params),
    staleTime: 60 * 1000, // 1 minute stale time
  });
}
