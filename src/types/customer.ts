export type CustomerStatus = 'Active' | 'Inactive' | 'Prospect' | 'Archive' | 'Lead' | string;

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  lastContact: string;
}
