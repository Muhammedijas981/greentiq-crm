import React, { useState } from 'react';
import { X, Search, Star, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterStatus from './filter-status';
import FilterCompany from './filter-company';
import FilterDateRange from './filter-date-range';
import FilterText from './filter-text';
import SavedFiltersList from './saved-filters-list';
import { FilterAction } from '@/hooks/use-filters';
import { FilterState } from '@/types/filter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface FilterPanelProps {
  onClose?: () => void;
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
}

export default function FilterPanel({ onClose, state, dispatch }: FilterPanelProps) {
  const queryClient = useQueryClient();
  const [saveName, setSaveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { data: savedFilters = [] } = useQuery({
    queryKey: ['saved-filters'],
    queryFn: () => apiClient.getSavedFilters(),
  });

  const saveMutation = useMutation({
    mutationFn: (name: string) => apiClient.createSavedFilter(name, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters'] });
      setIsSaving(false);
      setSaveName('');
    }
  });

  const handleSaveFilter = () => {
    if (!saveName.trim()) return;
    saveMutation.mutate(saveName);
  };

  return (
    <div className="w-full md:w-[320px] lg:w-[380px] bg-[#0f1423] border-l border-slate-800/60 h-full flex flex-col text-slate-200 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-100">Filters</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        
        <div className="flex flex-col gap-2">
          {isSaving ? (
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Filter Name..."
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                className="flex-1 bg-[#151a2a] border border-slate-700/50 rounded-md px-3 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
              />
              <Button size="sm" onClick={handleSaveFilter} disabled={!saveName.trim() || saveMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsSaving(false)} className="border-slate-700 text-slate-300">
                Cancel
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsSaving(true)}
              className="w-full justify-center bg-transparent border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300 gap-2"
            >
              <Save size={14} />
              Save Current Filter
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">Criteria</h3>
            <button 
              onClick={() => dispatch({ type: 'CLEAR_ALL' })}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Clear All
            </button>
          </div>

          <FilterStatus 
            selectedStatus={state.status} 
            onChange={(s) => dispatch({ type: 'TOGGLE_STATUS', payload: s })} 
          />

          <FilterCompany 
            selectedCompanies={state.company} 
            onChange={(c) => dispatch({ type: 'TOGGLE_COMPANY', payload: c })} 
          />

          <FilterDateRange 
            from={state.dateRange.from} 
            to={state.dateRange.to} 
            onChange={(r) => dispatch({ type: 'SET_DATE_RANGE', payload: r })} 
          />

          <FilterText 
            label="Phone Number" 
            placeholder="(555) 123-4567" 
            value={state.phone}
            onChange={(p) => dispatch({ type: 'SET_PHONE', payload: p })}
            icon={<Search size={14} />} 
          />

          <FilterText 
            label="Email Contains" 
            placeholder="e.g., @gmail.com" 
            value={state.email}
            onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e })}
            icon={<span className="text-sm">@</span>} 
          />
        </div>

        {/* Saved Filters */}
        <div className="space-y-3 pt-4 border-t border-slate-800/60">
          <h3 className="text-sm font-semibold text-slate-200">Saved Filters</h3>
          <SavedFiltersList 
            filters={savedFilters} 
            onApply={(state) => dispatch({ type: 'APPLY_SAVED_FILTER', payload: state })}
            currentState={state}
          />
        </div>
      </div>
    </div>
  );
}
