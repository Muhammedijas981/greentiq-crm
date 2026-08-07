import { NextResponse } from 'next/server';
import { savedFiltersStore } from '@/lib/saved-filters-store';

export async function PUT(request: Request) {
  try {
    const { startIndex, endIndex } = await request.json();
    
    if (typeof startIndex !== 'number' || typeof endIndex !== 'number') {
      return NextResponse.json({ error: 'Missing or invalid startIndex/endIndex' }, { status: 400 });
    }

    savedFiltersStore.reorder(startIndex, endIndex);
    
    return NextResponse.json({ success: true, data: savedFiltersStore.getAll() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reorder saved filters' }, { status: 500 });
  }
}
