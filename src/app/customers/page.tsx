'use client';

import React from 'react';
import PageHeader from '@/components/shared/page-header';
import CustomerTable from '@/components/customers/customer-table';
import CustomerCard from '@/components/customers/customer-card';
import { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import SearchBar from '@/components/layout/search-bar';
import Pagination from '@/components/shared/pagination';
import { useState } from 'react';
import CustomerForm from '@/components/customers/customer-form';
import CustomerDetailDrawer from '@/components/customers/customer-detail-drawer';
import FilterPanel from '@/components/filters/filter-panel';

// Dummy data for Phase 5 (will be removed in Phase 8)
const DUMMY_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Alice Green',
    email: 'alicegreen@gmail.com',
    phone: '874-748-8877',
    company: 'Acme Corp',
    status: 'Active',
    lastContact: '2023-11-03T10:00:00Z',
  },
  {
    id: '2',
    name: 'Bob Ross',
    email: 'bobross.coh@email.com',
    phone: '874-855-2469',
    company: 'Globex',
    status: 'Active',
    lastContact: '2023-11-03T11:30:00Z',
  },
  {
    id: '3',
    name: 'Charlie Davis',
    email: 'charliedavis@email.com',
    phone: '873-844-9576',
    company: 'Stark Industries',
    status: 'Archive',
    lastContact: '2023-11-03T14:15:00Z',
  },
  {
    id: '4',
    name: 'Ebron Ross',
    email: 'bobrIbonen@gmail.com',
    phone: '874-883-2621',
    company: 'Acme Corp',
    status: 'Inactive',
    lastContact: '2023-11-03T09:45:00Z',
  },
  {
    id: '5',
    name: 'John Ross',
    email: 'alicext.lob@email.com',
    phone: '879-833-8228',
    company: 'Globex',
    status: 'Lead',
    lastContact: '2023-11-03T16:20:00Z',
  },
  {
    id: '6',
    name: 'Bolo Ross',
    email: 'alicdendavis@gmail.com',
    phone: '873-632-2337',
    company: 'Stark Industries',
    status: 'Prospect',
    lastContact: '2023-11-03T15:00:00Z',
  }
];

export default function CustomersPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader 
        title="Customers" 
        action={
          <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus size={16} />
            Add Customer
          </Button>
        }
      />
      
      <div className="bg-[#151a2a] border border-slate-800/60 rounded-xl p-4 md:p-6 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchBar 
          value="" 
          onChange={() => {}} 
          placeholder="Search customers..." 
          className="w-full sm:w-80" 
        />
        <div className="flex gap-2 w-full sm:w-auto">
          {/* Mock filters for visual layout */}
          <select className="bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 w-full sm:w-auto focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>Status: All</option>
          </select>
          <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <CustomerTable customers={DUMMY_CUSTOMERS} onEdit={() => setIsDetailOpen(true)} />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {DUMMY_CUSTOMERS.map(customer => (
          <CustomerCard key={customer.id} customer={customer} onEdit={() => setIsDetailOpen(true)} />
        ))}
      </div>
      
      <Pagination 
        currentPage={1} 
        totalPages={15} 
        onPageChange={() => {}} 
      />

      {isAddOpen && <CustomerForm onClose={() => setIsAddOpen(false)} />}
      {isDetailOpen && <CustomerDetailDrawer onClose={() => setIsDetailOpen(false)} />}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <FilterPanel onClose={() => setIsFilterOpen(false)} />
        </div>
      )}
    </div>
  );
}
