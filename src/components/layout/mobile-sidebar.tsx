'use client';

import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, Users, Briefcase, CheckSquare, Settings } from 'lucide-react';
import Link from 'next/link';

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      <button 
        className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-200 focus:outline-none" 
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#0a0f1c]/80 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
            aria-hidden="true"
          />
          
          {/* Sidebar Drawer */}
          <div className="relative w-64 bg-[#0a0f1c] border-r border-slate-800/60 h-full flex flex-col shadow-2xl">
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  AR
                </div>
                <span className="text-slate-100 font-semibold text-sm">Alex R.</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-slate-400 hover:text-white p-1"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium text-sm transition-colors">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link href="/customers" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-500 font-medium text-sm transition-colors">
                <Users size={18} />
                Contacts
              </Link>
              <Link href="#" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium text-sm transition-colors">
                <Briefcase size={18} />
                Deals
              </Link>
              <Link href="#" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium text-sm transition-colors">
                <CheckSquare size={18} />
                Tasks
              </Link>
              <div className="mt-auto">
                <Link href="#" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium text-sm transition-colors">
                  <Settings size={18} />
                  Settings
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
