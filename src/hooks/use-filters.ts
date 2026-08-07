import { useReducer } from 'react';
import { FilterState } from '@/types/filter';

export type FilterAction =
  | { type: 'TOGGLE_STATUS'; payload: string }
  | { type: 'TOGGLE_COMPANY'; payload: string }
  | { type: 'SET_STATUS_EXACT'; payload: string[] }
  | { type: 'SET_COMPANY_EXACT'; payload: string[] }
  | { type: 'SET_DATE_RANGE'; payload: { from: string; to: string } }
  | { type: 'SET_PHONE'; payload: string }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'APPLY_SAVED_FILTER'; payload: FilterState };

const initialState: FilterState = {
  status: [],
  company: [],
  dateRange: { from: '', to: '' },
  phone: '',
  email: ''
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'TOGGLE_STATUS': {
      const exists = state.status.includes(action.payload);
      return {
        ...state,
        status: exists
          ? state.status.filter(s => s !== action.payload)
          : [...state.status, action.payload]
      };
    }
    case 'TOGGLE_COMPANY': {
      const exists = state.company.includes(action.payload);
      return {
        ...state,
        company: exists
          ? state.company.filter(c => c !== action.payload)
          : [...state.company, action.payload]
      };
    }
    case 'SET_STATUS_EXACT':
      return { ...state, status: action.payload };
    case 'SET_COMPANY_EXACT':
      return { ...state, company: action.payload };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload };
    case 'SET_PHONE':
      return { ...state, phone: action.payload };
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'CLEAR_ALL':
      return initialState;
    case 'APPLY_SAVED_FILTER':
      return action.payload;
    default:
      return state;
  }
}

export function useFilters(initial = initialState) {
  const [state, dispatch] = useReducer(filterReducer, initial);

  // Derive active filter count. We count each category as 1 active filter if it's being used.
  let count = 0;
  if (state.status.length > 0) count++;
  if (state.company.length > 0) count++;
  if (state.dateRange.from || state.dateRange.to) count++;
  if (state.phone) count++;
  if (state.email) count++;

  return {
    state,
    dispatch,
    activeFilterCount: count
  };
}
