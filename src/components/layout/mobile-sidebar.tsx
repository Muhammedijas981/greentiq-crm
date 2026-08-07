'use client';

import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, Users, Briefcase, CheckSquare, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CustomAvatar from '@/components/shared/custom-avatar';

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = href === '/' ? pathname === href : pathname.startsWith(href);
    return `flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
      isActive
        ? 'bg-blue-500/10 text-blue-500'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
    }`;
  };

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
        className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground focus:outline-none" 
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
            aria-hidden="true"
          />
          
          <div className="relative w-64 bg-background border-r border-border h-full flex flex-col shadow-2xl">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <div className="flex items-center gap-3">
                <CustomAvatar name="Alex R." fallback="AR" className="w-8 h-8 rounded-full" />
                <span className="text-foreground font-semibold text-sm">Alex R.</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-muted-foreground hover:text-foreground p-1"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
              <Link href="/" onClick={() => setIsOpen(false)} className={getLinkClass('/')}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link href="/customers" onClick={() => setIsOpen(false)} className={getLinkClass('/customers')}>
                <Users size={18} />
                Contacts
              </Link>
              <Link href="#" onClick={() => setIsOpen(false)} className={getLinkClass('/deals')}>
                <Briefcase size={18} />
                Deals
              </Link>
              <Link href="#" onClick={() => setIsOpen(false)} className={getLinkClass('/tasks')}>
                <CheckSquare size={18} />
                Tasks
              </Link>
              <Link href="#" onClick={() => setIsOpen(false)} className={getLinkClass('/settings')}>
                <Settings size={18} />
                Settings
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
