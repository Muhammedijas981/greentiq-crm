import { SavedFilter, FilterState } from '@/types/filter';

const defaultTemplates: SavedFilter[] = [
  {
    id: 'template-1',
    name: 'Actives',
    isTemplate: true,
    state: {
      status: ['Active'],
      company: [],
      dateRange: { from: '', to: '' },
      phone: '',
      email: ''
    }
  },
  {
    id: 'template-2',
    name: 'Recent Contacts',
    isTemplate: true,
    state: {
      status: [],
      company: [],
      dateRange: { 
        // past 30 days
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
      },
      phone: '',
      email: ''
    }
  },
  {
    id: 'template-3',
    name: 'Inactive Leads',
    isTemplate: true,
    state: {
      status: ['Lead'],
      company: [],
      dateRange: { 
        from: '', 
        // older than 90 days
        to: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
      },
      phone: '',
      email: ''
    }
  },
  {
    id: 'template-4',
    name: 'Inactives',
    isTemplate: true,
    state: {
      status: ['Inactive'],
      company: [],
      dateRange: { from: '', to: '' },
      phone: '',
      email: ''
    }
  }
];

let savedFilters: SavedFilter[] = [...defaultTemplates];

export const savedFiltersStore = {
  getAll: () => [...savedFilters],
  
  create: (name: string, state: FilterState) => {
    const newFilter: SavedFilter = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      state,
      isTemplate: false,
    };
    savedFilters.push(newFilter);
    return newFilter;
  },
  
  reorder: (startIndex: number, endIndex: number) => {
    const result = Array.from(savedFilters);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    savedFilters = result;
  }
};
