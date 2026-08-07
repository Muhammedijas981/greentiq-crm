import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone must be at least 7 characters").regex(/^[0-9+()-\s]*$/, "Invalid phone format"),
  company: z.string().min(1, "Company is required"),
  status: z.enum(['Active', 'Prospect', 'Lead', 'Inactive', 'Archive']),
  lastContact: z.string().min(1, "Last contact date is required"),
  notes: z.string().optional()
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
