import React from 'react';
import { Calendar } from 'lucide-react';

interface FilterDateRangeProps {
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
}

export default function FilterDateRange({ from, to, onChange }: FilterDateRangeProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-200">Date Range (Last Contact)</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-500">From</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="date" 
              value={from}
              onChange={(e) => onChange({ from: e.target.value, to })}
              className="w-full bg-[#151a2a] border border-slate-700/50 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500">To</label>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="date" 
              value={to}
              onChange={(e) => onChange({ from, to: e.target.value })}
              className="w-full bg-[#151a2a] border border-slate-700/50 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 [color-scheme:dark]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
