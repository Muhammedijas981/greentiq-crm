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
      <h3 className="text-sm font-medium text-slate-100">Company</h3>
      
      {selectedCompanies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCompanies.map(c => (
            <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full">
              {c}
              <button 
                onClick={() => onChange(c)}
                className="hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input 
          type="text" 
          placeholder="Add..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full bg-transparent border-b border-slate-700 py-1 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
        />
        <ChevronDown size={14} className="absolute right-0 top-2 text-slate-500" />
        
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredOptions.map(option => (
              <div 
                key={option}
                className="px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
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
