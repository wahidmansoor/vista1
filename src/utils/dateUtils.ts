/**
 * Date utility functions for formatting and handling dates in the application
 */

/**
 * Formats a date string or Date object into a readable format
 * @param dateInput Date string, ISO string, or Date object
 * @param options Optional Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateInput: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
): string {
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error formatting date';
  }
}

/**
 * Calculate the difference between two dates in days, months, or years
 * @param startDate The start date
 * @param endDate The end date (defaults to current date)
 * @param unit The unit to return (days, months, years)
 * @returns The difference in the specified unit
 */
export function getDateDifference(
  startDate: Date | string,
  endDate: Date | string = new Date(),
  unit: 'days' | 'months' | 'years' = 'days'
): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  // Check if dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date provided');
  }
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  
  switch (unit) {
    case 'days':
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    case 'months': {
      const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                     (end.getMonth() - start.getMonth());
      return months;
    }
    case 'years':
      return end.getFullYear() - start.getFullYear();
    default:
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

/**
 * Formats a date as a relative time (e.g., "2 days ago")
 * @param dateInput Date string or Date object
 * @returns Formatted relative time string
 */
export function getRelativeTimeString(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  if (diffInSeconds < minute) {
    return 'just now';
  } else if (diffInSeconds < hour) {
    const minutes = Math.floor(diffInSeconds / minute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < day) {
    const hours = Math.floor(diffInSeconds / hour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < week) {
    const days = Math.floor(diffInSeconds / day);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < month) {
    const weeks = Math.floor(diffInSeconds / week);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < year) {
    const months = Math.floor(diffInSeconds / month);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInSeconds / year);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}
