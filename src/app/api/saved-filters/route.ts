import { NextResponse } from 'next/server';
import { savedFiltersStore } from '@/lib/saved-filters-store';

export async function GET() {
  return NextResponse.json(savedFiltersStore.getAll());
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.state) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newFilter = savedFiltersStore.create(body.name, body.state);
    
    return NextResponse.json(newFilter, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
