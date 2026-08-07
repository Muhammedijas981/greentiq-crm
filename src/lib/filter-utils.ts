import { Customer } from '@/types/customer';
import { FilterState } from '@/types/filter';

/**
 * Pure function to apply a combination of search and advanced filters to an array of customers.
 * Uses strict AND logic: a customer must pass ALL active filters to be included.
 */
export function applyFilters(customers: Customer[], search: string, filters: FilterState): Customer[] {
  let result = customers;

  // Search
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(c => 
      c.name.toLowerCase().includes(s) || 
      c.email.toLowerCase().includes(s) ||
      c.company.toLowerCase().includes(s)
    );
  }

  // Status (Checkbox array)
  if (filters.status && filters.status.length > 0) {
    result = result.filter(c => filters.status.includes(c.status));
  }

  // Company (Multi-select chip array)
  if (filters.company && filters.company.length > 0) {
    result = result.filter(c => filters.company.includes(c.company));
  }

  // Date Range
  if (filters.dateRange) {
    if (filters.dateRange.from) {
      const fromDate = new Date(filters.dateRange.from).getTime();
      result = result.filter(c => new Date(c.lastContact).getTime() >= fromDate);
    }
    if (filters.dateRange.to) {
      // Set to end of day to include the to date
      const toDate = new Date(filters.dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(c => new Date(c.lastContact).getTime() <= toDate.getTime());
    }
  }

  // Phone (Partial string match)
  if (filters.phone) {
    // We do a simple includes so user can type area codes or partial numbers
    result = result.filter(c => c.phone.includes(filters.phone));
  }

  // Email Contains (Partial string match)
  if (filters.email) {
    const e = filters.email.toLowerCase();
    result = result.filter(c => c.email.toLowerCase().includes(e));
  }

  return result;
}
