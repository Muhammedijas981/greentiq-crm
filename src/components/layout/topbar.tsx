'use client';

import { Search, Bell, Activity } from 'lucide-react';
import MobileSidebar from './mobile-sidebar';
import { ThemeToggle } from './theme-toggle';

export default function Topbar() {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 gap-4">
      <div className="flex items-center gap-2 flex-1">
        <MobileSidebar />
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text" 
            placeholder="Search CRM..." 
            className="w-full bg-muted/50 border border-border rounded-lg py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <ThemeToggle />
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <Bell size={20} />
        </button>
        <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <Activity size={16} />
        </button>
      </div>
    </header>
  );
}
