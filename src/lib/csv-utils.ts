import { Customer } from '@/types/customer';

/**
 * Safely escapes a CSV field.
 * If the field contains quotes, commas, or newlines, it will be wrapped in double quotes
 * and existing double quotes will be escaped as two double quotes ("").
 */
function escapeCSVField(field: any): string {
  if (field === null || field === undefined) return '';
  const stringField = String(field);
  
  if (stringField.includes('"') || stringField.includes(',') || stringField.includes('\n') || stringField.includes('\r')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
}

/**
 * Generates a CSV string from an array of customers.
 */
export function generateCustomerCSV(customers: Customer[]): string {
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Company',
    'Status',
    'Last Contact Date',
    'Notes',
    'Created Date'
  ];

  const rows = customers.map(c => [
    c.name,
    c.email,
    c.phone,
    c.company,
    c.status,
    c.lastContact ? new Date(c.lastContact).toISOString() : '',
    c.notes || '',
    c.createdDate ? new Date(c.createdDate).toISOString() : ''
  ]);

  const csvContent = [
    headers.map(escapeCSVField).join(','),
    ...rows.map(row => row.map(escapeCSVField).join(','))
  ].join('\n');

  return csvContent;
}
