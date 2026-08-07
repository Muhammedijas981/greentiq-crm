'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, CheckSquare, Settings } from 'lucide-react';
import CustomAvatar from '@/components/shared/custom-avatar';

export default function Sidebar() {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    // Exact match for root, startsWith for others to handle nested routes like /customers/123
    const isActive = href === '/' ? pathname === href : pathname.startsWith(href);
    return `flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
      isActive
        ? 'bg-blue-500/10 text-blue-500'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
    }`;
  };
  return (
    <aside className="w-64 bg-background border-r border-border hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <CustomAvatar name="Alex R." fallback="AR" className="w-8 h-8 rounded-full" />
          <span className="text-foreground font-semibold text-sm">Alex R.</span>
        </div>
      </div>
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
        <Link href="/" className={getLinkClass('/')}>
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link href="/customers" className={getLinkClass('/customers')}>
          <Users size={18} />
          Contacts
        </Link>
        <Link href="#" className={getLinkClass('/deals')}>
          <Briefcase size={18} />
          Deals
        </Link>
        <Link href="#" className={getLinkClass('/tasks')}>
          <CheckSquare size={18} />
          Tasks
        </Link>
        <Link href="#" className={getLinkClass('/settings')}>
          <Settings size={18} />
          Settings
        </Link>
      </nav>
    </aside>
  );
}
