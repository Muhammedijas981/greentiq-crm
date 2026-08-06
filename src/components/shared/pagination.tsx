'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-slate-400 hidden sm:block">
        Showing page {currentPage} of {totalPages || 1}
      </div>
      
      <div className="flex items-center gap-1 bg-[#1e293b] p-1 rounded-lg border border-slate-800">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </button>
        
        <div className="flex items-center gap-1 px-2">
          <button className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${currentPage === 1 ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>1</button>
          {totalPages > 3 && <MoreHorizontal size={16} className="text-slate-500" />}
          {totalPages > 1 && <button className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>{totalPages}</button>}
        </div>

        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
