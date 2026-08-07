import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-store';
import { applyFilters } from '@/lib/filter-utils';
import { FilterState } from '@/types/filter';
import { generateCustomerCSV } from '@/lib/csv-utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const company = searchParams.get('company') || '';
  const advancedFiltersRaw = searchParams.get('advancedFilters');
  const sort = searchParams.get('sort') || 'name'; 
  const order = searchParams.get('order') || 'asc';

  let customers = mockStore.getAll();

  if (advancedFiltersRaw) {
    try {
      const filters = JSON.parse(advancedFiltersRaw) as FilterState;
      customers = applyFilters(customers, search, filters);
    } catch (e) {
      console.error("Failed to parse advanced filters", e);
      if (search) {
        const s = search.toLowerCase();
        customers = customers.filter(c => 
          c.name.toLowerCase().includes(s) || 
          c.email.toLowerCase().includes(s) ||
          c.company.toLowerCase().includes(s)
        );
      }
    }
  } else {
    // Legacy fallback
    if (search) {
      const s = search.toLowerCase();
      customers = customers.filter(c => 
        c.name.toLowerCase().includes(s) || 
        c.email.toLowerCase().includes(s) ||
        c.company.toLowerCase().includes(s)
      );
    }

    if (status && status !== 'All') {
      customers = customers.filter(c => c.status === status);
    }
    if (company && company !== 'All') {
      customers = customers.filter(c => c.company === company);
    }
  }

  // Sort
  customers.sort((a, b) => {
    let valA: string | number = a[sort as keyof typeof a] || '';
    let valB: string | number = b[sort as keyof typeof b] || '';
    
    if (sort === 'lastContact' || sort === 'createdDate') {
      valA = new Date(valA as string).getTime();
      valB = new Date(valB as string).getTime();
    } else {
      valA = (valA as string).toLowerCase();
      valB = (valB as string).toLowerCase();
    }

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  // No pagination, export all currently filtered customers.
  const csvContent = generateCustomerCSV(customers);

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="customers-export.csv"',
    },
  });
}
