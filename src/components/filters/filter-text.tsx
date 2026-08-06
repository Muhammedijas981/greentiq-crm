import React from 'react';

interface FilterTextProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}

export default function FilterText({ label, value, onChange, placeholder, icon }: FilterTextProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-100">{label}</h3>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 flex items-center justify-center">
            {icon}
          </div>
        )}
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-[#151a2a] border border-slate-700/50 rounded-lg py-2 pr-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500 ${icon ? 'pl-9' : 'pl-3'}`}
        />
      </div>
    </div>
  );
}
