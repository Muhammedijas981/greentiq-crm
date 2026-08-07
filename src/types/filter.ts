export interface FilterState {
  status: string[];
  company: string[];
  dateRange: {
    from: string;
    to: string;
  };
  phone: string;
  email: string;
}

export interface SavedFilter {
  id: string;
  name: string;
  state: FilterState;
  isTemplate: boolean;
}
