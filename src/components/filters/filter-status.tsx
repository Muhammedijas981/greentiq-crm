import React from 'react';

interface FilterStatusProps {
  selectedStatus: string[];
  onChange: (status: string) => void;
}

const statusOptions = [
  { id: 'Active', label: 'Active' },
  { id: 'Prospect', label: 'Prospect' },
  { id: 'Lead', label: 'Lead' },
  { id: 'Inactive', label: 'Inactive' },
  { id: 'Archive', label: 'Archive' },
];

export default function FilterStatus({ selectedStatus, onChange }: FilterStatusProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Status</h3>
      </div>
      <div className="space-y-1.5">
        {statusOptions.map((status) => {
          const checked = selectedStatus.includes(status.id);
          return (
            <label key={status.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="hidden"
                checked={checked}
                onChange={() => onChange(status.id)}
              />
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                checked ? 'bg-blue-600 border-blue-600 text-foreground' : 'border-border group-hover:border-border'
              }`}>
                {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className="text-sm text-muted-foreground group-hover:text-foreground">{status.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
