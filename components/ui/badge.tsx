import { clsx } from 'clsx';
import { ReactNode } from 'react';

export interface BadgeProps {
  className?: string;
  variant?: 'outline' | 'default';
  children?: ReactNode;
}

export function Badge({ className, variant = 'default', children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        variant === 'outline' ? 
          'border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300' :
          'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
        className
      )}
    >
      {children}
    </span>
  );
}