import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface StandardInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input label */
  label?: string;
  /** Input description */
  description?: string;
  /** Error message */
  error?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Icon to display before input */
  icon?: React.ComponentType<{ className?: string }>;
  /** Icon to display after input */
  iconAfter?: React.ComponentType<{ className?: string }>;
  /** Input size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the required asterisk */
  showRequiredAsterisk?: boolean;
}

/**
 * Standardized Input Component
 * 
 * This component uses the unified design tokens and ensures consistent
 * input styling across all modules.
 * 
 * Features:
 * - Consistent styling using design tokens
 * - Label and description support
 * - Error state handling
 * - Icon support (before and after)
 * - Proper accessibility attributes
 * - Multiple sizes
 * - Required field indication
 */
export const StandardInput = React.forwardRef<HTMLInputElement, StandardInputProps>(
  ({ 
    label,
    description,
    error,
    required = false,
    icon: Icon,
    iconAfter: IconAfter,
    size = 'md',
    showRequiredAsterisk = true,
    className,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    const baseClasses = 'w-full border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base'
    };

    const stateClasses = error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200';

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-5 h-5'
    };

    const paddingWithIcon = {
      sm: Icon ? 'pl-10' : IconAfter ? 'pr-10' : '',
      md: Icon ? 'pl-12' : IconAfter ? 'pr-12' : '',
      lg: Icon ? 'pl-12' : IconAfter ? 'pr-12' : ''
    };

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && showRequiredAsterisk && (
              <span className="text-red-500 ml-1" aria-label="required">*</span>
            )}
          </label>
        )}

        {/* Description */}
        {description && (
          <p 
            id={descriptionId}
            className="text-sm text-gray-600"
          >
            {description}
          </p>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Leading Icon */}
          {Icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon className={cn(iconSizes[size], 'text-gray-400')} />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              baseClasses,
              sizeClasses[size],
              stateClasses,
              paddingWithIcon[size],
              className
            )}
            aria-describedby={cn(
              descriptionId,
              errorId
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-required={required}
            {...props}
          />

          {/* Trailing Icon or Error Icon */}
          {(IconAfter || error) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {error ? (
                <AlertCircle className={cn(iconSizes[size], 'text-red-400')} />
              ) : IconAfter ? (
                <IconAfter className={cn(iconSizes[size], 'text-gray-400')} />
              ) : null}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p 
            id={errorId}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

StandardInput.displayName = 'StandardInput';

export default StandardInput;
