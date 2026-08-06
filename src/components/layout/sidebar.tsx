import Link from 'next/link';
import { LayoutDashboard, Users, Briefcase, CheckSquare, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0a0f1c] border-r border-slate-800/60 hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            AR
          </div>
          <span className="text-slate-100 font-semibold text-sm">Alex R.</span>
        </div>
      </div>
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-500 font-medium text-sm">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
        <Link href="/customers" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium text-sm transition-colors">
          <Users size={18} />
          Contacts
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium text-sm transition-colors">
          <Briefcase size={18} />
          Deals
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium text-sm transition-colors">
          <CheckSquare size={18} />
          Tasks
        </Link>
        <div className="mt-auto">
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium text-sm transition-colors">
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </nav>
    </aside>
  );
}
