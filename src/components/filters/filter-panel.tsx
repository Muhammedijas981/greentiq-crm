'use client';

import React from 'react';
import { X, Search, Calendar, Star, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FilterPanel({ onClose }: { onClose?: () => void }) {
  return (
    <div className="w-full md:w-[320px] lg:w-[380px] bg-[#0f1423] border-l border-slate-800/60 h-full flex flex-col text-slate-200 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-100">Filters</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <Button variant="outline" className="w-full justify-center bg-transparent border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300">
          Save Filter
        </Button>

        {/* Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-100">Status</h3>
            <button className="text-xs text-slate-400 hover:text-slate-200">Clear All</button>
          </div>
          <div className="space-y-2">
            {[
              { id: 'active', label: 'Active Customer', checked: true },
              { id: 'prospect', label: 'Prospect', checked: true },
              { id: 'lead', label: 'Lead', checked: false },
              { id: 'inactive', label: 'Inactive Customer', checked: false },
              { id: 'archive', label: 'Archive', checked: false },
            ].map((status) => (
              <label key={status.id} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  status.checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-600 group-hover:border-slate-500'
                }`}>
                  {status.checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span className="text-sm text-slate-300 group-hover:text-slate-100">{status.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Company */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-100">Company</h3>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full">
              Acme Corp
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full">
              Innovatech
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full">
              Globex
            </span>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Add..." 
              className="w-full bg-transparent border-b border-slate-700 py-1 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <ChevronDown size={14} className="absolute right-0 top-2 text-slate-500" />
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-100">Date Range (Last Contact)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-500">From</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="2023-10-DD" 
                  className="w-full bg-[#151a2a] border border-slate-700/50 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-500">To</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  defaultValue="2023-12-31" 
                  className="w-full bg-[#151a2a] border border-slate-700/50 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-100">Phone Number</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="(555) 123-4567" 
              className="w-full bg-[#151a2a] border border-slate-700/50 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Email Contains */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-100">Email Contains</h3>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">@</span>
            <input 
              type="text" 
              placeholder="e.g., @gmail.com" 
              className="w-full bg-[#151a2a] border border-slate-700/50 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Apply Filters
        </Button>

        {/* Saved Filters */}
        <div className="space-y-3 pt-4 border-t border-slate-800/60">
          <h3 className="text-sm font-medium text-slate-100">Saved Filters</h3>
          <ul className="space-y-1">
            <li>
              <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 transition-colors">
                <span>Active Customers</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 transition-colors">
                <span>Recent Contacts</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 transition-colors">
                <span>Inactive Leads</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 transition-colors group">
                <span>High-value prospects</span>
                <Star size={14} className="text-slate-500 group-hover:text-blue-400" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
