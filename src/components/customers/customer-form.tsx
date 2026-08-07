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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-[480px] bg-card border border-border rounded-xl shadow-2xl flex flex-col my-auto">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h2 className="text-lg font-medium text-foreground">{mode === 'create' ? 'Add Customer' : 'Edit Customer'}</h2>
          <button onClick={onClose} disabled={isPending} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="px-5 py-4 space-y-3">
          
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Name <span className="text-muted-foreground">*</span></label>
            <div className="relative">
              <input 
                type="text" 
                {...register('name')}
                className={`w-full bg-background border rounded-lg py-1.5 pl-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-1 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-border focus:border-blue-500 focus:ring-blue-500/50'}`}
              />
              {!errors.name && <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 opacity-50" />}
            </div>
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Email <span className="text-muted-foreground">*</span></label>
            <div className="relative">
              <input 
                type="email" 
                {...register('email')}
                className={`w-full bg-background border rounded-lg py-1.5 pl-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-1 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-border focus:border-blue-500 focus:ring-blue-500/50'}`}
              />
              {!errors.email && <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 opacity-50" />}
            </div>
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Phone <span className="text-muted-foreground">*</span></label>
            <input 
              type="tel" 
              {...register('phone')}
              className={`w-full bg-background border rounded-lg py-1.5 px-3 text-sm text-foreground focus:outline-none focus:ring-1 ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-border focus:border-blue-500 focus:ring-blue-500/50'}`}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Company <span className="text-muted-foreground">*</span></label>
            <input 
              type="text" 
              {...register('company')}
              className={`w-full bg-background border rounded-lg py-1.5 px-3 text-sm text-foreground focus:outline-none focus:ring-1 ${errors.company ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-border focus:border-blue-500 focus:ring-blue-500/50'}`}
            />
            {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="space-y-1 flex-1">
              <label className="text-sm text-muted-foreground">Status</label>
              <div className="relative">
                <select 
                  {...register('status')}
                  className={`w-full bg-background border rounded-lg py-1.5 pl-3 pr-10 text-sm text-foreground appearance-none focus:outline-none focus:ring-1 ${errors.status ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-border focus:border-blue-500 focus:ring-blue-500/50'}`}
                >
                  <option value="Active">Active</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Lead">Lead</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Archive">Archive</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-sm text-muted-foreground">Last Contact Date <span className="text-muted-foreground">*</span></label>
              <div className="relative">
                <input 
                  type="date" 
                  {...register('lastContact')}
                  className={`w-full bg-background border rounded-lg py-1.5 pl-9 pr-3 text-sm text-foreground focus:outline-none focus:ring-1 [color-scheme:dark] ${errors.lastContact ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-border focus:border-blue-500 focus:ring-blue-500/50'}`}
                />
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              {errors.lastContact && <p className="text-xs text-red-500">{errors.lastContact.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Notes</label>
            <textarea 
              rows={3}
              {...register('notes')}
              className={`w-full bg-background border rounded-lg py-1.5 px-3 text-sm text-foreground focus:outline-none focus:ring-1 resize-none ${errors.notes ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : 'border-border focus:border-blue-500 focus:ring-blue-500/50'}`}
            />
            {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
          </div>

        </form>

        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-border bg-muted/30 rounded-b-xl">
          <Button variant="ghost" onClick={onClose} disabled={isPending} className="text-sm h-8 text-muted-foreground hover:text-foreground hover:bg-muted">
            Cancel
          </Button>
          <Button type="submit" form="customer-form" disabled={isPending} className="text-sm h-8 bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]">
            {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : (mode === 'create' ? 'Add Customer' : 'Save Changes')}
          </Button>
        </div>
      </div>
    </div>
  );
}
