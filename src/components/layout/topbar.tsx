'use client';

import { Search, Bell, Activity } from 'lucide-react';
import MobileSidebar from './mobile-sidebar';

export default function Topbar() {
  return (
    <header className="h-16 bg-[#0a0f1c] border-b border-slate-800/60 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 gap-4">
      <div className="flex items-center gap-2 flex-1">
        <MobileSidebar />
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search CRM..." 
            className="w-full bg-[#1e293b]/50 border border-slate-700/50 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button className="text-slate-400 hover:text-slate-200 transition-colors p-1">
          <Bell size={20} />
        </button>
        <button className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
          <Activity size={16} />
        </button>
      </div>
    </header>
  );
}
