'use client';

import React from 'react';
import { X, CheckCircle2, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CustomerForm({ onClose }: { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#151a2a] border border-slate-800 rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
          <h2 className="text-xl font-semibold text-slate-100">Add Customer</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Name <span className="text-slate-500">*required *</span></label>
            <div className="relative">
              <input 
                type="text" 
                defaultValue="John Doe"
                className="w-full bg-[#0a0f1c] border border-slate-700/50 rounded-lg py-2.5 pl-3 pr-10 text-sm text-slate-200 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 border-green-500/30"
              />
              <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Email <span className="text-slate-500">*required *</span></label>
            <div className="relative">
              <input 
                type="email" 
                defaultValue="john.doe@example.com"
                className="w-full bg-[#0a0f1c] border border-slate-700/50 rounded-lg py-2.5 pl-3 pr-10 text-sm text-slate-200 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 border-green-500/30"
              />
              <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Phone <span className="text-slate-500">*</span></label>
            <input 
              type="tel" 
              defaultValue="+1 (555) 123-4567"
              className="w-full bg-[#0a0f1c] border border-slate-700/50 rounded-lg py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Company */}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Company</label>
            <input 
              type="text" 
              defaultValue="Acme Corp"
              className="w-full bg-[#0a0f1c] border border-slate-700/50 rounded-lg py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Status & Date pair */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-1.5 flex-1">
              <label className="text-sm text-slate-300">Status</label>
              <div className="relative">
                <select className="w-full bg-[#0a0f1c] border border-slate-700/50 rounded-lg py-2.5 pl-3 pr-10 text-sm text-slate-200 appearance-none focus:outline-none focus:border-blue-500">
                  <option>Active Customer</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5 flex-1">
              <label className="text-sm text-slate-300">Last Contact Date</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="15/10/2023"
                  className="w-full bg-[#0a0f1c] border border-slate-700/50 rounded-lg py-2.5 pl-3 pr-10 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Notes</label>
            <textarea 
              rows={4}
              defaultValue="Meeting notes and follow-up items..."
              className="w-full bg-[#0a0f1c] border border-slate-700/50 rounded-lg py-3 px-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/60 bg-[#1e293b]/30 rounded-b-xl">
          <Button variant="ghost" onClick={onClose} className="text-slate-300 hover:text-white hover:bg-slate-800">
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Add Customer
          </Button>
        </div>
      </div>
    </div>
  );
}
