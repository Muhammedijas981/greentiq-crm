import { Customer } from '@/types/customer';
import { SavedFilter, FilterState } from '@/types/filter';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetCustomersParams {
  search?: string;
  status?: string; // Legacy simple filter (can be removed if advanced replaces it, but kept for compatibility)
  company?: string;
  advancedFilters?: string; // JSON string of FilterState
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const apiClient = {
  getCustomers: async (params?: GetCustomersParams): Promise<PaginatedResponse<Customer>> => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const response = await fetch(`/api/customers?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch customers');
    return response.json();
  },
  
  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await fetch(`/api/customers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch customer');
    return response.json();
  },
  
  createCustomer: async (data: Omit<Customer, 'id' | 'createdDate'>): Promise<Customer> => {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create customer');
    return response.json();
  },
  
  updateCustomer: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update customer');
    return response.json();
  },
  
  deleteCustomer: async (id: string): Promise<void> => {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete customer');
  },

  // Saved Filters
  getSavedFilters: async (): Promise<SavedFilter[]> => {
    const response = await fetch('/api/saved-filters');
    if (!response.ok) throw new Error('Failed to fetch saved filters');
    return response.json();
  },

  createSavedFilter: async (name: string, state: FilterState): Promise<SavedFilter> => {
    const response = await fetch('/api/saved-filters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, state }),
    });
    if (!response.ok) throw new Error('Failed to create saved filter');
    return response.json();
  },

  async reorderSavedFilters(startIndex: number, endIndex: number) {
    const response = await fetch('/api/saved-filters/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startIndex, endIndex }),
    });
    if (!response.ok) throw new Error('Failed to reorder saved filters');
    return response.json();
  }
};
