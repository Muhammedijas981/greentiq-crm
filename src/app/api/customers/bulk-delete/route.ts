import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ids } = body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid ids' }, { status: 400 });
    }
    
    mockStore.bulkRemove(ids);
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
