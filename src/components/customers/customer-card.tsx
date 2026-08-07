'use client';

import React from 'react';
import { Customer } from '@/types/customer';
import StatusBadge from './status-badge';
import CustomAvatar from '../shared/custom-avatar';
import { Pencil, Trash2, Mail, Phone, Building2, Calendar, Check } from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export default function CustomerCard({ customer, onEdit, onDelete, isSelected = false, onToggleSelect }: CustomerCardProps) {
  return (
    <div className={`bg-[#151a2a] border ${isSelected ? 'border-blue-500/50 bg-blue-900/10' : 'border-slate-800/60'} rounded-xl p-5 flex flex-col gap-4 relative transition-colors`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex items-center justify-center w-4 h-4">
              <input 
                type="checkbox" 
                className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                checked={isSelected}
                onChange={() => onToggleSelect?.(customer.id)}
              />
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                isSelected ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-slate-500'
              }`}>
                {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
              </div>
            </div>
          </div>
          <CustomAvatar 
            name={customer.name}
            fallback={customer.name.substring(0, 2).toUpperCase()} 
            className="w-10 h-10 rounded-full" 
          />
          <div>
            <h3 className="font-semibold text-slate-100">{customer.name}</h3>
            <div className="mt-1">
              <StatusBadge status={customer.status} />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit?.(customer); }}
            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete?.(customer); }}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2 pt-2 border-t border-slate-800/60 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-slate-500" />
          <span className="truncate">{customer.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-slate-500" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-slate-500" />
          <span className="truncate">{customer.company}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 mt-1">
          <Calendar size={14} className="text-slate-500" />
          <span>Last contact: {new Date(customer.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
