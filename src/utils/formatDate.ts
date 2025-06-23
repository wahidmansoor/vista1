import { format, isValid } from 'date-fns';

/**
 * Formats a date string to a readable format
 */
export const formatDate = (date: string | Date): string => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return isValid(parsedDate) 
    ? format(parsedDate, 'PPP')
    : 'Invalid Date';
};
