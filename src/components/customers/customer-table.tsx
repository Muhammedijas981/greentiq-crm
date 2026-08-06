'use client';

import React from 'react';
import { Customer } from '@/types/customer';
import StatusBadge from './status-badge';
import CustomAvatar from '../shared/custom-avatar';
import { Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  sort?: string;
  order?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export default function CustomerTable({ customers, onEdit, onDelete, sort, order, onSort }: CustomerTableProps) {
  const renderHeader = (field: string, label: string) => {
    const isSortable = ['name', 'email', 'lastContact'].includes(field);
    if (!isSortable) {
      return <th scope="col" className="px-6 py-4 font-medium">{label}</th>;
    }

    return (
      <th 
        scope="col" 
        className="px-6 py-4 font-medium cursor-pointer select-none hover:bg-slate-800/50 transition-colors"
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
    <div className="w-full overflow-hidden rounded-xl border border-slate-800/60 bg-[#151a2a]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 bg-slate-900/50 uppercase border-b border-slate-800/60">
            <tr>
              {renderHeader('name', 'Name')}
              {renderHeader('email', 'Email')}
              {renderHeader('phone', 'Phone')}
              {renderHeader('company', 'Company')}
              {renderHeader('status', 'Status')}
              {renderHeader('lastContact', 'Last Contact')}
              <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <CustomAvatar 
                      fallback={customer.name.substring(0, 2).toUpperCase()} 
                      className="w-8 h-8 rounded-full text-xs" 
                    />
                    <span className="font-medium text-slate-200">{customer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4 text-slate-400">{customer.phone}</td>
                <td className="px-6 py-4">{customer.company}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={customer.status} />
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {new Date(customer.lastContact).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onEdit?.(customer)}
                      className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors"
                      title="Edit Customer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete?.(customer)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
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
          <div className="p-8 text-center text-slate-500">
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
}
