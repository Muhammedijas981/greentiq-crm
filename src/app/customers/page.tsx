'use client';

import React from 'react';
import PageHeader from '@/components/shared/page-header';
import CustomerTable from '@/components/customers/customer-table';
import CustomerCard from '@/components/customers/customer-card';
import { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Plus, Filter, ChevronDown, Check, Trash2, Download } from 'lucide-react';
import SearchBar from '@/components/layout/search-bar';
import Pagination from '@/components/shared/pagination';
import { useState, useEffect, useRef } from 'react';
import CustomerForm from '@/components/customers/customer-form';
import CustomerDetailDrawer from '@/components/customers/customer-detail-drawer';
import FilterPanel from '@/components/filters/filter-panel';
import { useFilters } from '@/hooks/use-filters';
import { useCustomers } from '@/hooks/use-customers';
import { useKeyboardShortcut } from '@/hooks/use-keyboard-shortcut';
import { useDebounce } from '@/hooks/use-debounce';
import LoadingSkeleton from '@/components/shared/loading-skeleton';
import EmptyState from '@/components/shared/empty-state';
import { useBulkSelection } from '@/hooks/use-bulk-selection';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

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
        className="flex items-center gap-2 h-9 bg-card border border-border text-muted-foreground text-sm rounded-md px-3 outline-none focus:border-blue-500 hover:bg-muted/50 transition-colors"
      >
        {selectedLabel}
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 left-0 z-50 w-48 bg-card border border-border rounded-md shadow-lg py-1">
          {options.map(opt => (
            <button
              key={opt.value}
              disabled={opt.disabled}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between ${opt.disabled ? 'text-muted-foreground cursor-not-allowed' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
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

  // Keyboard Shortcuts
  useKeyboardShortcut('cmd-k', () => {
    setIsFilterOpen(true);
  });

  useKeyboardShortcut('escape', () => {
    // Close the topmost open modal/drawer
    if (isBulkDeleteOpen) setIsBulkDeleteOpen(false);
    else if (isFilterOpen) setIsFilterOpen(false);
    else if (isDetailOpen) setIsDetailOpen(false);
    else if (isEditOpen) setIsEditOpen(false);
    else if (isAddOpen) setIsAddOpen(false);
  });

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

  const { selectedIds, toggle, selectAll, clear } = useBulkSelection();
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const bulkUpdateMutation = useMutation({
    mutationFn: (args: { ids: string[]; data: Partial<Customer> }) => apiClient.bulkUpdateCustomers(args.ids, args.data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      clear();
      toast.success(`${variables.ids.length} customer${variables.ids.length === 1 ? '' : 's'} updated successfully`);
    },
    onError: (err) => toast.error(err.message || 'Failed to update customers')
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => apiClient.bulkDeleteCustomers(ids),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      clear();
      setIsBulkDeleteOpen(false);
      toast.success(`${variables.length} customer${variables.length === 1 ? '' : 's'} deleted successfully`);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete customers');
      setIsBulkDeleteOpen(false);
    }
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

  const handleExportCSV = () => {
    const searchParams = new URLSearchParams();
    if (debouncedSearch) searchParams.set('search', debouncedSearch);
    if (debouncedFilterState && Object.keys(debouncedFilterState).length > 0) {
      searchParams.set('advancedFilters', JSON.stringify(debouncedFilterState));
    }
    if (sort) searchParams.set('sort', sort);
    if (order) searchParams.set('order', order);
    
    window.location.href = `/api/customers/export?${searchParams.toString()}`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader 
        title="Customers" 
        action={
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportCSV} className="gap-2 text-muted-foreground border-border hover:bg-muted">
              <Download size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
            <Button onClick={() => { setSelectedCustomer(null); setIsAddOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus size={16} />
              <span className="hidden sm:inline">Add Customer</span>
            </Button>
          </div>
        }
      />
      
      <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between relative">
        {selectedIds.size > 0 && (
          <div className="absolute inset-0 z-10 bg-muted backdrop-blur-sm rounded-xl flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <span className="text-foreground font-medium bg-slate-700/50 px-2 py-1 rounded-md border border-border/50">
                {selectedIds.size} Selected
              </span>
              <button 
                onClick={clear}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex items-center gap-3">
              <QuickSelect
                value="Set Status"
                options={[
                  { value: "Set Status", label: "Set Status...", disabled: true },
                  { value: "Active", label: "Active" },
                  { value: "Prospect", label: "Prospect" },
                  { value: "Lead", label: "Lead" },
                  { value: "Inactive", label: "Inactive" },
                  { value: "Archive", label: "Archive" }
                ]}
                onChange={(val) => {
                  if (val !== "Set Status") {
                    bulkUpdateMutation.mutate({ ids: Array.from(selectedIds), data: { status: val as any } });
                  }
                }}
              />
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-9 gap-2"
                onClick={() => setIsBulkDeleteOpen(true)}
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Delete Selected</span>
              </Button>
            </div>
          </div>
        )}
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
              { value: "Active", label: "Active" },
              { value: "Prospect", label: "Prospect" },
              { value: "Lead", label: "Lead" },
              { value: "Inactive", label: "Inactive" },
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

          <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="h-9 border-border text-muted-foreground hover:bg-muted relative">
            <Filter size={16} className="mr-2" />
            Filters
            <kbd className="ml-2 hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-foreground text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-background">
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
              selectedIds={selectedIds}
              onToggleSelect={toggle}
              onSelectAll={(select) => selectAll(data.data.map((c: Customer) => c.id), select)}
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
                  isSelected={selectedIds.has(customer.id)}
                  onToggleSelect={toggle}
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

      <ConfirmDialog 
        isOpen={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        title="Delete Selected Customers"
        description={`Are you sure you want to delete ${selectedIds.size} selected customer${selectedIds.size === 1 ? '' : 's'}? This action cannot be undone.`}
        confirmLabel="Delete Customers"
        onConfirm={() => bulkDeleteMutation.mutate(Array.from(selectedIds))}
      />
    </div>
  );
}
