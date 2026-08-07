'use client';

import React from 'react';
import PageHeader from '@/components/shared/page-header';
import CustomerTable from '@/components/customers/customer-table';
import CustomerCard from '@/components/customers/customer-card';
import { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Plus, Filter, ChevronDown, Check } from 'lucide-react';
import SearchBar from '@/components/layout/search-bar';
import Pagination from '@/components/shared/pagination';
import { useState, useEffect, useRef } from 'react';
import CustomerForm from '@/components/customers/customer-form';
import CustomerDetailDrawer from '@/components/customers/customer-detail-drawer';
import FilterPanel from '@/components/filters/filter-panel';
import { useFilters } from '@/hooks/use-filters';
import { useCustomers } from '@/hooks/use-customers';
import { useDebounce } from '@/hooks/use-debounce';
import LoadingSkeleton from '@/components/shared/loading-skeleton';
import EmptyState from '@/components/shared/empty-state';

function QuickSelect({ value, options, onChange }: { value: string, options: {value: string, label: string, disabled?: boolean}[], onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || value;
  
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-9 bg-[#151a2a] border border-slate-700/50 text-slate-300 text-sm rounded-md px-3 outline-none focus:border-blue-500 hover:bg-slate-800/50 transition-colors"
      >
        {selectedLabel}
        <ChevronDown size={14} className="text-slate-400" />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 z-50 w-48 bg-[#0f1423] border border-slate-700 rounded-md shadow-lg py-1">
          {options.map(opt => (
            <button
              key={opt.value}
              disabled={opt.disabled}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${opt.disabled ? 'text-slate-500 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              {opt.label}
              {value === opt.value && !opt.disabled && <Check size={14} className="text-blue-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Dummy data for Phase 5 (will be removed in Phase 8)
// Dummy data removed in Phase 7. Will be fetched via API in Phase 8.

export default function CustomersPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [order, setOrder] = useState<'asc'|'desc'>('asc');
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(search, 300);
  
  // Advanced Filters
  const { state: filterState, dispatch: filterDispatch, activeFilterCount } = useFilters();
  const debouncedFilterState = useDebounce(filterState, 300);

  // Reset page to 1 when filters or sort change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedFilterState, sort, order]);

  // Query Data
  const { data, isLoading, isError, error } = useCustomers({
    search: debouncedSearch,
    advancedFilters: JSON.stringify(debouncedFilterState),
    sort,
    order,
    page,
    limit,
  });

  const handleSearchChange = (val: string) => {
    setSearch(val);
  };


  const handleSort = (field: string) => {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field);
      setOrder('asc');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader 
        title="Customers" 
        action={
          <Button onClick={() => { setSelectedCustomer(null); setIsAddOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Plus size={16} />
            Add Customer
          </Button>
        }
      />
      
      <div className="bg-[#151a2a] border border-slate-800/60 rounded-xl p-4 md:p-6 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <SearchBar 
          value={search} 
          onChange={handleSearchChange} 
          placeholder="Search customers..." 
          className="w-full sm:w-80" 
        />
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {/* Quick Filters */}
          <QuickSelect
            value={filterState.status.length === 1 ? filterState.status[0] : filterState.status.length > 1 ? "Multiple" : "All"}
            options={[
              { value: "All", label: "Status: All" },
              ...(filterState.status.length > 1 ? [{ value: "Multiple", label: "Multiple Selected", disabled: true }] : []),
              { value: "Active Customer", label: "Active Customer" },
              { value: "Prospect", label: "Prospect" },
              { value: "Lead", label: "Lead" },
              { value: "Inactive Customer", label: "Inactive Customer" },
              { value: "Archive", label: "Archive" }
            ]}
            onChange={(val) => {
              if (val === "All" || val === "Multiple") {
                filterDispatch({ type: 'SET_STATUS_EXACT', payload: [] });
              } else {
                filterDispatch({ type: 'SET_STATUS_EXACT', payload: [val] });
              }
            }}
          />
          
          <QuickSelect
            value={filterState.company.length === 1 ? filterState.company[0] : filterState.company.length > 1 ? "Multiple" : "All"}
            options={[
              { value: "All", label: "Company: All" },
              ...(filterState.company.length > 1 ? [{ value: "Multiple", label: "Multiple Selected", disabled: true }] : []),
              { value: "Acme Corp", label: "Acme Corp" },
              { value: "Innovatech", label: "Innovatech" },
              { value: "Globex", label: "Globex" },
              { value: "Stark Industries", label: "Stark Industries" },
              { value: "Wayne Enterprises", label: "Wayne Enterprises" }
            ]}
            onChange={(val) => {
              if (val === "All" || val === "Multiple") {
                filterDispatch({ type: 'SET_COMPANY_EXACT', payload: [] });
              } else {
                filterDispatch({ type: 'SET_COMPANY_EXACT', payload: [val] });
              }
            }}
          />

          <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="h-9 border-slate-700 text-slate-300 hover:bg-slate-800 relative">
            <Filter size={16} className="mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-[#151a2a]">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4">
          <LoadingSkeleton type="table-row" count={5} />
        </div>
      ) : isError ? (
        <EmptyState 
          title="Failed to load customers" 
          description={error instanceof Error ? error.message : "Something went wrong"} 
        />
      ) : !data || data.data.length === 0 ? (
        <EmptyState 
          title="No customers found" 
          description="Try adjusting your search or filters." 
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <CustomerTable 
              customers={data.data} 
              onRowClick={(customer) => { setSelectedCustomer(customer); setIsDetailOpen(true); }}
              onEdit={(customer) => { setSelectedCustomer(customer); setIsEditOpen(true); }}
              onDelete={(customer) => { setSelectedCustomer(customer); setIsDetailOpen(true); }}
              sort={sort}
              order={order}
              onSort={handleSort}
            />
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-4">
            {data.data.map((customer: Customer) => (
              <div key={customer.id} onClick={() => { setSelectedCustomer(customer); setIsDetailOpen(true); }}>
                <CustomerCard 
                  customer={customer} 
                  onEdit={(c) => { setSelectedCustomer(c || customer); setIsEditOpen(true); }} 
                  onDelete={(c) => { setSelectedCustomer(c || customer); setIsDetailOpen(true); }}
                />
              </div>
            ))}
          </div>
          
          <Pagination 
            currentPage={data.meta.page} 
            totalPages={data.meta.totalPages} 
            onPageChange={setPage} 
          />
        </>
      )}

      {isAddOpen && <CustomerForm onClose={() => setIsAddOpen(false)} mode="create" />}
      {isEditOpen && selectedCustomer && (
        <CustomerForm 
          onClose={() => { setIsEditOpen(false); setSelectedCustomer(null); }} 
          mode="edit" 
          initialData={selectedCustomer} 
        />
      )}
      {isDetailOpen && selectedCustomer && (
        <CustomerDetailDrawer 
          onClose={() => { setIsDetailOpen(false); setSelectedCustomer(null); }} 
          customer={selectedCustomer}
          onEdit={() => { setIsDetailOpen(false); setIsEditOpen(true); }}
        />
      )}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <FilterPanel 
            onClose={() => setIsFilterOpen(false)} 
            initialState={filterState}
            onApply={(newState) => {
              filterDispatch({ type: 'APPLY_SAVED_FILTER', payload: newState });
              setIsFilterOpen(false);
            }}
            onClear={() => {
              filterDispatch({ type: 'CLEAR_ALL' });
            }}
          />
        </div>
      )}
    </div>
  );
}
