'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export default function SearchBar({ placeholder = "Search...", value, onChange, className = "" }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} 
        className="w-full bg-muted/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
      />
    </div>
  );
}
