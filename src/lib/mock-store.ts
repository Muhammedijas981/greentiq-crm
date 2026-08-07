import { Customer } from '@/types/customer';
import customersData from '@/data/customers.json';

/**
 * MOCK STORE
 * 
 * WHY IT'S MODULE-LEVEL:
 * In Next.js App Router (running in a Node.js server environment), module-level variables
 * persist across multiple incoming requests within the SAME server instance.
 * By keeping `customers` as a module-level array, we can simulate a persistent database 
 * for mutations (POST/PATCH/DELETE) without needing a real database. When you add a customer, 
 * subsequent GET requests will see the newly added customer.
 * 
 * KNOWN LIMITATION:
 * This state only lives in server memory. If the server is restarted, or if deployed to a 
 * serverless environment (like Vercel) where serverless functions spin up and down (cold starts),
 * this array will reset back to the original `customers.json` state. 
 * This is strictly for demonstration/assessment purposes.
 */

// Initialize our "database" with the JSON data
let customers: Customer[] = [...(customersData as Customer[])];

export const mockStore = {
  getAll: () => {
    return [...customers]; // Return a copy
  },
  
  getById: (id: string) => {
    return customers.find(c => c.id === id);
  },
  
  create: (data: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...data,
      id: Math.random().toString(36).substring(2, 9), // generate a random ID
    };
    customers.push(newCustomer);
    return newCustomer;
  },
  
  update: (id: string, data: Partial<Customer>) => {
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    customers[index] = { ...customers[index], ...data };
    return customers[index];
  },
  
  remove: (id: string) => {
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    customers.splice(index, 1);
    return true;
  },

  bulkUpdate: (ids: string[], data: Partial<Customer>) => {
    customers = customers.map(c => 
      ids.includes(c.id) ? { ...c, ...data } : c
    );
    return true;
  },

  bulkRemove: (ids: string[]) => {
    customers = customers.filter(c => !ids.includes(c.id));
    return true;
  }
};
