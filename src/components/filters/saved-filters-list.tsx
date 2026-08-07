'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Star } from 'lucide-react';
import { SavedFilter } from '@/types/filter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface SortableItemProps {
  filter: SavedFilter;
  onApply: (state: any) => void;
  isActive?: boolean;
}

function SortableItem({ filter, onApply, isActive }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: filter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li ref={setNodeRef} style={style} className={`relative group flex items-center justify-between rounded-lg transition-colors ${isActive ? 'bg-[#1e293b]' : 'hover:bg-slate-800/50'}`}>
      <button 
        {...attributes} 
        {...listeners} 
        className={`p-2 cursor-grab active:cursor-grabbing ${isActive ? 'text-slate-400' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <GripVertical size={14} />
      </button>
      
      <button 
        onClick={() => onApply(filter.state)}
        className={`flex-1 flex items-center justify-between px-2 py-2 text-sm ${isActive ? 'text-slate-100 font-medium' : 'text-slate-300 hover:text-slate-100'}`}
      >
        <span>{filter.name}</span>
        {!filter.isTemplate && <Star size={14} fill="currentColor" className={isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'} />}
      </button>
    </li>
  );
}

interface SavedFiltersListProps {
  filters: SavedFilter[];
  onApply: (state: any) => void;
  currentState?: any;
}

export default function SavedFiltersList({ filters, onApply, currentState }: SavedFiltersListProps) {
  const [items, setItems] = useState<SavedFilter[]>(filters);
  const queryClient = useQueryClient();

  useEffect(() => {
    setItems(filters);
  }, [filters]);

  const reorderMutation = useMutation({
    mutationFn: (args: { startIndex: number, endIndex: number }) => 
      apiClient.reorderSavedFilters(args.startIndex, args.endIndex),
    onSuccess: () => {
      // Invalidate to ensure sync with server state
      queryClient.invalidateQueries({ queryKey: ['saved-filters'] });
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require 5px movement before drag starts to allow clicks to pass through
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        // Optimistic UI update locally
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Persist the change to the mock API store.
        // We calculate oldIndex and newIndex from the original sorted list items array.
        reorderMutation.mutate({ startIndex: oldIndex, endIndex: newIndex });
        
        return newItems;
      });
    }
  };

  const isFilterActive = (filterState: any, current: any) => {
    if (!current) return false;
    try {
      const s1 = [...(filterState.status || [])].sort();
      const s2 = [...(current.status || [])].sort();
      if (JSON.stringify(s1) !== JSON.stringify(s2)) return false;

      const c1 = [...(filterState.company || [])].sort();
      const c2 = [...(current.company || [])].sort();
      if (JSON.stringify(c1) !== JSON.stringify(c2)) return false;

      if (filterState.dateRange?.from !== current.dateRange?.from) return false;
      if (filterState.dateRange?.to !== current.dateRange?.to) return false;
      if (filterState.phone !== current.phone) return false;
      if (filterState.email !== current.email) return false;

      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <ul className="space-y-1">
        <SortableContext 
          items={items.map(f => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((filter) => (
            <SortableItem 
              key={filter.id} 
              filter={filter} 
              onApply={onApply} 
              isActive={isFilterActive(filter.state, currentState)}
            />
          ))}
        </SortableContext>
      </ul>
    </DndContext>
  );
}
