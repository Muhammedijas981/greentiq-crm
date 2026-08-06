'use client';

import React, { useState } from 'react';
import { X, Copy, Trash2, Edit2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Customer } from '@/types/customer';
import { useDeleteCustomer } from '@/hooks/use-customer-mutations';
import ConfirmDialog from '@/components/shared/confirm-dialog';
import { toast } from 'sonner';

interface CustomerDetailDrawerProps {
  onClose: () => void;
  customer: Customer;
  onEdit: () => void;
}

export default function CustomerDetailDrawer({ onClose, customer, onEdit }: CustomerDetailDrawerProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deleteMutation = useDeleteCustomer();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active Customer': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Prospect': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Lead': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Inactive Customer': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Archive': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleDelete = () => {
    deleteMutation.mutate(customer.id, {
      onSuccess: () => {
        toast.success('Customer deleted successfully');
        onClose();
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete customer');
      }
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-[500px] bg-[#0a0f1c] border-l border-slate-800/60 h-full flex flex-col shadow-2xl">
          
          {/* Top bar */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
            <h2 className="text-lg font-semibold text-slate-100">Customer Details</h2>
            <button onClick={onClose} disabled={deleteMutation.isPending} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            
            {/* Header Profile Section */}
            <div className="p-6 border-b border-slate-800/60 bg-[#151a2a]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {getInitials(customer.name)}
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-slate-100 leading-tight">{customer.name}</h1>
                    {customer.company && (
                      <p className="text-sm font-medium text-slate-300 mt-2 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-indigo-500/20 flex items-center justify-center text-[8px]">🏢</span> 
                        {customer.company}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsConfirmOpen(true)}
                    disabled={deleteMutation.isPending}
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 h-9 px-3 bg-transparent"
                  >
                    {deleteMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </Button>
                  <Button 
                    onClick={onEdit} 
                    disabled={deleteMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-3"
                  >
                    <Edit2 size={16} className="mr-2" />
                    Edit
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
                        <span className="text-sm text-blue-400 hover:underline cursor-pointer break-all">{customer.email}</span>
                        <button onClick={() => copyToClipboard(customer.email)} className="text-slate-500 hover:text-slate-300"><Copy size={14} /></button>
                      </div>
                    </div>
                    {customer.phone && (
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">Phone</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-300">{customer.phone}</span>
                          <button onClick={() => copyToClipboard(customer.phone!)} className="text-slate-500 hover:text-slate-300"><Copy size={14} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Company & Status */}
                <div className="space-y-5">
                  <h3 className="text-sm font-semibold text-slate-100">Details</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-slate-500 block mb-1">Status</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </div>
                    {customer.company && (
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">Company</span>
                        <span className="text-sm text-slate-300">{customer.company}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timelines */}
              <div className="space-y-4 border-t border-slate-800/60 pt-6">
                <h3 className="text-sm font-semibold text-slate-100">Timelines</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Last Contact</span>
                    <span className="text-sm text-slate-300">{new Date(customer.lastContact).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Created Date</span>
                    <span className="text-sm text-slate-300">{new Date(customer.createdDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {customer.notes && (
                <div className="space-y-4 border-t border-slate-800/60 pt-6 pb-8">
                  <h3 className="text-sm font-semibold text-slate-100">Notes</h3>
                  <div className="bg-[#151a2a] border border-slate-800 rounded-lg p-4">
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {customer.notes}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Delete Customer"
        description={`Are you sure you want to delete ${customer.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
      />
    </>
  );
}
