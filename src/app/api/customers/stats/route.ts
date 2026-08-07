import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock-store';

export async function GET() {
  const customers = mockStore.getAll();
  
  const totalCustomers = customers.length;
  
  const activeLeads = customers.filter(c => 
    c.status.toLowerCase() === 'lead' || c.status.toLowerCase() === 'prospect'
  ).length;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const contactedThisWeek = customers.filter(c => {
    if (!c.lastContact) return false;
    const contactDate = new Date(c.lastContact);
    return contactDate >= sevenDaysAgo;
  }).length;

  return NextResponse.json({
    totalCustomers,
    activeLeads,
    contactedThisWeek
  });
}
