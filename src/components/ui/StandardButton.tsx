import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface StandardButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  /** Button size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether button is loading */
  loading?: boolean;
  /** Icon to display before text */
  icon?: React.ComponentType<{ className?: string }>;
  /** Icon to display after text */
  iconAfter?: React.ComponentType<{ className?: string }>;
  /** Whether button should take full width */
  fullWidth?: boolean;
}

/**
 * Standardized Button Component
 * 
 * This component uses the unified design tokens and ensures consistent
 * button styling across all modules.
 * 
 * Features:
 * - Multiple variants with consistent styling
 * - Loading states with spinner
 * - Icon support (before and after text)
 * - Proper accessibility attributes
 * - Consistent sizing using design tokens
 * - Responsive behavior
 */
export const StandardButton = React.forwardRef<HTMLButtonElement, StandardButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon: Icon,
    iconAfter: IconAfter,
    fullWidth = false,
    children, 
    className,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500 shadow-sm',
      outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm'
    };

    const sizeClasses = {
      xs: 'px-2.5 py-1.5 text-xs rounded-md gap-1',
      sm: 'px-3 py-2 text-sm rounded-md gap-2',
      md: 'px-4 py-2.5 text-sm rounded-md gap-2',
      lg: 'px-6 py-3 text-base rounded-lg gap-2',
      xl: 'px-8 py-4 text-lg rounded-lg gap-3'
    };

    const iconSizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6'
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
        ) : Icon ? (
          <Icon className={iconSizes[size]} />
        ) : null}
        
        {children && <span>{children}</span>}
        
        {IconAfter && !loading && (
          <IconAfter className={iconSizes[size]} />
        )}
      </button>
    );
  }
);

StandardButton.displayName = 'StandardButton';

export default StandardButton;
