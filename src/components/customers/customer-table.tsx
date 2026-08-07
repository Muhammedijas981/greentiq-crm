'use client';

import React from 'react';
import { Customer } from '@/types/customer';
import StatusBadge from './status-badge';
import CustomAvatar from '../shared/custom-avatar';
import { Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown, Check } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  onRowClick?: (customer: Customer) => void;
  sort?: string;
  order?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onSelectAll?: (select: boolean) => void;
}

export default function CustomerTable({ customers, onEdit, onDelete, onRowClick, sort, order, onSort, selectedIds = new Set(), onToggleSelect, onSelectAll }: CustomerTableProps) {
  const allSelected = customers.length > 0 && customers.every(c => selectedIds.has(c.id));
  
  const renderHeader = (field: string, label: string) => {
    const isSortable = ['name', 'email', 'lastContact'].includes(field);
    if (!isSortable) {
      return <th scope="col" className="px-6 py-4 font-medium">{label}</th>;
    }

    return (
      <th 
        scope="col" 
        className="px-6 py-4 font-medium cursor-pointer select-none hover:bg-muted/50 transition-colors"
        onClick={() => onSort?.(field)}
      >
        <div className="flex items-center gap-2">
          {label}
          {sort === field ? (
            order === 'asc' ? <ArrowUp size={14} className="text-blue-500" /> : <ArrowDown size={14} className="text-blue-500" />
          ) : (
            <ArrowUpDown size={14} className="text-slate-600 opacity-0 group-hover:opacity-100" />
          )}
        </div>
      </th>
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-muted-foreground">
          <thead className="text-xs text-muted-foreground bg-card/50 uppercase border-b border-border">
            <tr>
              <th scope="col" className="px-6 py-4 w-10">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <input 
                    type="checkbox" 
                    className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                    checked={allSelected}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                  />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    allSelected ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-slate-300 dark:border-slate-600'
                  }`}>
                    {allSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
              </th>
              {renderHeader('name', 'Name')}
              {renderHeader('email', 'Email')}
              {renderHeader('phone', 'Phone')}
              {renderHeader('company', 'Company')}
              {renderHeader('status', 'Status')}
              {renderHeader('lastContact', 'Last Contact')}
              <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((customer) => (
              <tr 
                key={customer.id} 
                className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${selectedIds.has(customer.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                onClick={() => onRowClick?.(customer)}
              >
                <td className="px-6 py-4 w-10" onClick={(e) => e.stopPropagation()}>
                  <div className="relative flex items-center justify-center w-4 h-4">
                    <input 
                      type="checkbox" 
                      className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                      checked={selectedIds.has(customer.id)}
                      onChange={() => onToggleSelect?.(customer.id)}
                    />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      selectedIds.has(customer.id) ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-slate-300 dark:border-slate-600'
                    }`}>
                      {selectedIds.has(customer.id) && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <CustomAvatar 
                      name={customer.name}
                      fallback={customer.name.substring(0, 2).toUpperCase()} 
                      className="w-8 h-8 rounded-full text-xs" 
                    />
                    <span className="font-medium text-foreground">{customer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4 text-muted-foreground">{customer.phone}</td>
                <td className="px-6 py-4">{customer.company}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={customer.status} />
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(customer.lastContact).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit?.(customer); }}
                      className="p-1.5 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors"
                      title="Edit Customer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete?.(customer); }}
                      className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
}
