'use client';

import React from 'react';
import { X, CheckCircle2, Calendar, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, CustomerFormValues } from '@/lib/validation';
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/use-customer-mutations';
import { toast } from 'sonner';
import { Customer } from '@/types/customer';

interface CustomerFormProps {
  onClose: () => void;
  mode?: 'create' | 'edit';
  initialData?: Customer;
}

export default function CustomerForm({ onClose, mode = 'create', initialData }: CustomerFormProps) {
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      company: initialData?.company || '',
      status: (initialData?.status as any) || 'Prospect',
      lastContact: initialData?.lastContact || new Date().toISOString().split('T')[0],
      notes: initialData?.notes || '',
    }
  });

  const onSubmit = (data: CustomerFormValues) => {
    if (mode === 'create') {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success('Customer created successfully');
          onClose();
        },
        onError: (err) => toast.error(err.message || 'Failed to create customer')
      });
    } else if (mode === 'edit' && initialData) {
      updateMutation.mutate({ id: initialData.id, data }, {
        onSuccess: () => {
          toast.success('Customer updated successfully');
          onClose();
        },
        onError: (err) => toast.error(err.message || 'Failed to update customer')
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#151a2a] border border-slate-800 rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60">
          <h2 className="text-xl font-semibold text-slate-100">{mode === 'create' ? 'Add Customer' : 'Edit Customer'}</h2>
          <button onClick={onClose} disabled={isPending} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Name <span className="text-slate-500">*</span></label>
            <div className="relative">
              <input 
                type="text" 
                {...register('name')}
                className={`w-full bg-[#0a0f1c] border rounded-lg py-2.5 pl-3 pr-10 text-sm text-slate-200 focus:outline-none focus:ring-1 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/50'}`}
              />
              {!errors.name && <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 opacity-50" />}
            </div>
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Email <span className="text-slate-500">*</span></label>
            <div className="relative">
              <input 
                type="email" 
                {...register('email')}
                className={`w-full bg-[#0a0f1c] border rounded-lg py-2.5 pl-3 pr-10 text-sm text-slate-200 focus:outline-none focus:ring-1 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/50'}`}
              />
              {!errors.email && <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 opacity-50" />}
            </div>
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Phone <span className="text-slate-500">*</span></label>
            <input 
              type="tel" 
              {...register('phone')}
              className={`w-full bg-[#0a0f1c] border rounded-lg py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:ring-1 ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/50'}`}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          {/* Company */}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Company <span className="text-slate-500">*</span></label>
            <input 
              type="text" 
              {...register('company')}
              className={`w-full bg-[#0a0f1c] border rounded-lg py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:ring-1 ${errors.company ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/50'}`}
            />
            {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
          </div>

          {/* Status & Date pair */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-1.5 flex-1">
              <label className="text-sm text-slate-300">Status</label>
              <div className="relative">
                <select 
                  {...register('status')}
                  className={`w-full bg-[#0a0f1c] border rounded-lg py-2.5 pl-3 pr-10 text-sm text-slate-200 appearance-none focus:outline-none focus:ring-1 ${errors.status ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/50'}`}
                >
                  <option value="Active Customer">Active Customer</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Lead">Lead</option>
                  <option value="Inactive Customer">Inactive Customer</option>
                  <option value="Archive">Archive</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
              {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>
            <div className="space-y-1.5 flex-1">
              <label className="text-sm text-slate-300">Last Contact Date <span className="text-slate-500">*</span></label>
              <div className="relative">
                <input 
                  type="date" 
                  {...register('lastContact')}
                  className={`w-full bg-[#0a0f1c] border rounded-lg py-2.5 pl-10 pr-3 text-sm text-slate-200 focus:outline-none focus:ring-1 [color-scheme:dark] ${errors.lastContact ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/50'}`}
                />
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
              {errors.lastContact && <p className="text-xs text-red-500">{errors.lastContact.message}</p>}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Notes</label>
            <textarea 
              rows={4}
              {...register('notes')}
              className={`w-full bg-[#0a0f1c] border rounded-lg py-3 px-3 text-sm text-slate-200 focus:outline-none focus:ring-1 resize-none ${errors.notes ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-slate-700/50 focus:border-blue-500 focus:ring-blue-500/50'}`}
            />
            {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
          </div>

        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800/60 bg-[#1e293b]/30 rounded-b-xl">
          <Button variant="ghost" onClick={onClose} disabled={isPending} className="text-slate-300 hover:text-white hover:bg-slate-800">
            Cancel
          </Button>
          <Button type="submit" form="customer-form" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
            {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : (mode === 'create' ? 'Add Customer' : 'Save Changes')}
          </Button>
        </div>
      </div>
    </div>
  );
}
