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
import { useState, useEffect } from 'react';
import CustomerForm from '@/components/customers/customer-form';
import CustomerDetailDrawer from '@/components/customers/customer-detail-drawer';
import FilterPanel from '@/components/filters/filter-panel';
import { useFilters } from '@/hooks/use-filters';
import { useCustomers } from '@/hooks/use-customers';
import { useDebounce } from '@/hooks/use-debounce';
import LoadingSkeleton from '@/components/shared/loading-skeleton';
import EmptyState from '@/components/shared/empty-state';

// Dummy data for Phase 5 (will be removed in Phase 8)
// Dummy data removed in Phase 7. Will be fetched via API in Phase 8.

export default function CustomersPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
          <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
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
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="border-slate-700 text-slate-300 hover:bg-slate-800 relative">
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
              onEdit={() => setIsDetailOpen(true)}
              sort={sort}
              order={order}
              onSort={handleSort}
            />
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-4">
            {data.data.map((customer: Customer) => (
              <CustomerCard key={customer.id} customer={customer} onEdit={() => setIsDetailOpen(true)} />
            ))}
          </div>
          
          <Pagination 
            currentPage={data.meta.page} 
            totalPages={data.meta.totalPages} 
            onPageChange={setPage} 
          />
        </>
      )}

      {isAddOpen && <CustomerForm onClose={() => setIsAddOpen(false)} />}
      {isDetailOpen && <CustomerDetailDrawer onClose={() => setIsDetailOpen(false)} />}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <FilterPanel 
            onClose={() => setIsFilterOpen(false)} 
            state={filterState}
            dispatch={filterDispatch}
          />
        </div>
      )}
    </div>
  );
}
