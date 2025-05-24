import { format, formatDistance, isValid } from 'date-fns';

export const getRelativeTime = (date: string | Date) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  return isValid(parsedDate)
    ? formatDistance(parsedDate, new Date(), { addSuffix: true })
    : 'Invalid Date';
};

/**
 * Generates a unique ID with an optional prefix
 */
export const generateId = (prefix: string = ''): string => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateSeverityLevel = (score: number): 'mild' | 'moderate' | 'severe' => {
  if (score <= 3) return 'mild';
  if (score <= 6) return 'moderate';
  return 'severe';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Groups assessments by date for timeline view
 */
export const groupByDate = <T extends { date: string }>(
  items: T[]
): Record<string, T[]> => {
  return items.reduce((groups, item) => {
    const date = new Date(item.date).toISOString().split('T')[0];
    return {
      ...groups,
      [date]: [...(groups[date] || []), item]
    };
  }, {} as Record<string, T[]>);
};

/**
 * Sorts an array of objects by date
 * @param items Array of objects with a date property
 * @param direction 'asc' or 'desc'
 */
export function sortByDate<T extends { date: string }>(
  items: T[],
  direction: 'asc' | 'desc' = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return direction === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const downloadAsJson = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};