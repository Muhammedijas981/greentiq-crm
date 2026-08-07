import React, { useState, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface FilterCompanyProps {
  selectedCompanies: string[];
  onChange: (company: string) => void;
}

const mockCompanyOptions = [
  'Acme Corp', 'Innovatech', 'Globex', 'Stark Industries', 'Wayne Enterprises'
];

export default function FilterCompany({ selectedCompanies, onChange }: FilterCompanyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = mockCompanyOptions.filter(c => 
    c.toLowerCase().includes(search.toLowerCase()) && 
    !selectedCompanies.includes(c)
  );

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Company</h3>
      
      <div className="relative flex flex-wrap gap-1.5 p-1.5 bg-card border border-border rounded-lg min-h-[40px] items-center">
        {selectedCompanies.map(c => (
          <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-700 text-foreground text-xs rounded-md">
            {c}
            <button 
              onClick={() => onChange(c)}
              className="hover:text-foreground transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <div className="flex-1 min-w-[80px] flex items-center relative">
          <input 
            type="text" 
            placeholder="Add..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            className="w-full bg-transparent text-sm text-foreground focus:outline-none pr-6 pl-1"
          />
          <ChevronDown size={14} className="absolute right-1 text-muted-foreground pointer-events-none" />
        </div>
        
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-muted border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredOptions.map(option => (
              <div 
                key={option}
                className="px-3 py-2 text-sm text-muted-foreground hover:bg-muted/80 hover:text-foreground cursor-pointer"
                onMouseDown={() => {
                  onChange(option);
                  setSearch('');
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
