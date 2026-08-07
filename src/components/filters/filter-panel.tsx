import React, { useState } from 'react';
import { X, Search, Star, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FilterStatus from './filter-status';
import FilterCompany from './filter-company';
import FilterDateRange from './filter-date-range';
import FilterText from './filter-text';
import SavedFiltersList from './saved-filters-list';
import { useFilters } from '@/hooks/use-filters';
import { FilterState } from '@/types/filter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface FilterPanelProps {
  onClose?: () => void;
  initialState: FilterState;
  onApply: (state: FilterState) => void;
  onClear: () => void;
}

export default function FilterPanel({ onClose, initialState, onApply, onClear }: FilterPanelProps) {
  const queryClient = useQueryClient();
  const [saveName, setSaveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const { state: localState, dispatch: localDispatch } = useFilters(initialState);

  const { data: savedFilters = [] } = useQuery({
    queryKey: ['saved-filters'],
    queryFn: () => apiClient.getSavedFilters(),
  });

  const saveMutation = useMutation({
    mutationFn: (name: string) => apiClient.createSavedFilter(name, localState),
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
    <div className="w-full md:w-[320px] lg:w-[380px] bg-card border-l border-border h-full flex flex-col text-foreground shadow-2xl">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Search size={18} className="text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
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
                className="flex-1 bg-card border border-border rounded-md px-3 text-sm text-muted-foreground focus:outline-none focus:border-blue-500"
              />
              <Button size="sm" onClick={handleSaveFilter} disabled={!saveName.trim() || saveMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsSaving(false)} className="border-border text-muted-foreground">
                Cancel
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setIsSaving(true)}
              className="w-full justify-center bg-transparent border-border hover:bg-muted hover:text-foreground text-muted-foreground gap-2"
            >
              <Save size={14} />
              Save Current Filter
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Criteria</h3>
            <button 
              onClick={() => {
                localDispatch({ type: 'CLEAR_ALL' });
                onClear();
              }}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Clear All
            </button>
          </div>

          <FilterStatus 
            selectedStatus={localState.status} 
            onChange={(s) => localDispatch({ type: 'TOGGLE_STATUS', payload: s })} 
          />

          <FilterCompany 
            selectedCompanies={localState.company} 
            onChange={(c) => localDispatch({ type: 'TOGGLE_COMPANY', payload: c })} 
          />

          <FilterDateRange 
            from={localState.dateRange.from} 
            to={localState.dateRange.to} 
            onChange={(r) => localDispatch({ type: 'SET_DATE_RANGE', payload: r })} 
          />

          <FilterText 
            label="Phone Number" 
            placeholder="(555) 123-4567" 
            value={localState.phone}
            onChange={(p) => localDispatch({ type: 'SET_PHONE', payload: p })}
            icon={<Search size={14} />} 
          />

          <FilterText 
            label="Email Contains" 
            placeholder="e.g., @gmail.com" 
            value={localState.email}
            onChange={(e) => localDispatch({ type: 'SET_EMAIL', payload: e })}
            icon={<span className="text-sm">@</span>} 
          />
          
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
            onClick={() => onApply(localState)}
          >
            Apply Filters
          </Button>
        </div>

        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground">Saved Filters</h3>
          <SavedFiltersList 
            filters={savedFilters} 
            onApply={(savedState) => localDispatch({ type: 'APPLY_SAVED_FILTER', payload: savedState })}
            currentState={localState}
          />
        </div>
      </div>
    </div>
  );
}
