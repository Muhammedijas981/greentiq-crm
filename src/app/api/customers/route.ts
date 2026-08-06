import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-store';
import { applyFilters } from '@/lib/filter-utils';
import { FilterState } from '@/types/filter';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const company = searchParams.get('company') || '';
  const advancedFiltersRaw = searchParams.get('advancedFilters');
  const sort = searchParams.get('sort') || 'name'; // name, email, lastContact
  const order = searchParams.get('order') || 'asc';
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  let customers = mockStore.getAll();

  if (advancedFiltersRaw) {
    try {
      const filters = JSON.parse(advancedFiltersRaw) as FilterState;
      customers = applyFilters(customers, search, filters);
    } catch (e) {
      console.error("Failed to parse advanced filters", e);
      // fallback to just search if parsing fails
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
    // 1. Search (legacy fallback)
    if (search) {
      const s = search.toLowerCase();
      customers = customers.filter(c => 
        c.name.toLowerCase().includes(s) || 
        c.email.toLowerCase().includes(s) ||
        c.company.toLowerCase().includes(s)
      );
    }

    // 2. Legacy Filters
    if (status && status !== 'All') {
      customers = customers.filter(c => c.status === status);
    }
    if (company && company !== 'All') {
      customers = customers.filter(c => c.company === company);
    }
  }

  // 3. Sort
  customers.sort((a, b) => {
    let valA: string | number = a[sort as keyof typeof a] || '';
    let valB: string | number = b[sort as keyof typeof b] || '';
    
    // Handle dates
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

  // 4. Pagination
  const total = customers.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedCustomers = customers.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedCustomers,
    meta: {
      total,
      page,
      limit,
      totalPages,
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real app we'd validate with Zod here
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newCustomer = mockStore.create({
      ...body,
      createdDate: new Date().toISOString(),
    });
    
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
