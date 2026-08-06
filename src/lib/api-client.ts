import { Customer } from '@/types/customer';

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
  status?: string;
  company?: string;
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
  }
};
