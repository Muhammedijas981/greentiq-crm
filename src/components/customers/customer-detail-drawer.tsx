'use client';

import React from 'react';
import { X, Copy, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CustomerDetailDrawer({ onClose }: { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-[500px] bg-[#0a0f1c] border-l border-slate-800/60 h-full flex flex-col shadow-2xl">
        
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
          <h2 className="text-lg font-semibold text-slate-100">Customer Details</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          
          {/* Header Profile Section */}
          <div className="p-6 border-b border-slate-800/60 bg-[#151a2a]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                  EH
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-100 leading-tight">Eleanor Henderson</h1>
                  <p className="text-sm text-slate-400 mt-1">Marketing Director</p>
                  <p className="text-sm font-medium text-slate-300 mt-0.5 flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-indigo-500/20 flex items-center justify-center text-[8px]">📈</span> 
                    Innovate Solutions Inc.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 h-9 px-3 bg-transparent">
                  Delete
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-3">
                  Edit Customer
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            
            {/* Info Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-slate-100">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Email</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-blue-400 hover:underline cursor-pointer">eleanor.h@innovate.io</span>
                      <button className="text-slate-500 hover:text-slate-300"><Copy size={14} /></button>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Phone</span>
                    <span className="text-sm text-slate-300">+1 (555) 234-5678</span>
                  </div>
                </div>
              </div>

              {/* Company & Status */}
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-slate-100">Company & Status</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Company</span>
                    <span className="text-sm text-slate-300">Innovate Solutions Inc.</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active Client
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Deal Value</span>
                    <span className="text-sm text-slate-300 font-medium">$45,000</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Account Owner</span>
                    <span className="text-sm text-slate-300">Sarah Chen</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timelines */}
            <div className="space-y-4 border-t border-slate-800/60 pt-6">
              <h3 className="text-sm font-semibold text-slate-100">Timelines</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Last Contact</span>
                  <span className="text-sm text-slate-300">Oct 14, 2023, 2:30 PM</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Created Date</span>
                  <span className="text-sm text-slate-300">Jan 10, 2022</span>
                </div>
              </div>
            </div>

            {/* Notes & Interactions */}
            <div className="space-y-4 border-t border-slate-800/60 pt-6 pb-8">
              <h3 className="text-sm font-semibold text-slate-100">Notes & Interactions</h3>
              
              <div className="space-y-3">
                <div className="bg-[#151a2a] border border-slate-800 rounded-lg p-4 relative">
                  <span className="absolute top-4 right-4 text-xs text-slate-500">14 Oct</span>
                  <p className="text-sm text-slate-300 leading-relaxed pr-12">
                    Met at TechCrunch Disrupt. Discussed Q4 marketing campaign. 
                    Sent proposal. Very engaged. Next meeting scheduled for Oct 20th.
                  </p>
                </div>
                <div className="bg-[#151a2a] border border-slate-800 rounded-lg p-4 relative">
                  <span className="absolute top-4 right-4 text-xs text-slate-500">09 Oct</span>
                  <p className="text-sm text-slate-300 leading-relaxed pr-12 text-slate-400">
                    Left voicemail following up on initial demo.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
