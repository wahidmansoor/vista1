import { clsx } from 'clsx';
import { ReactNode } from 'react';

export interface ButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

export function Button({
  className,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  icon,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Variant styles
        variant === 'primary' && 
          'bg-blue-600 hover:bg-blue-700 text-white',
        variant === 'secondary' &&
          'bg-gray-200 hover:bg-gray-300 text-gray-900',
        variant === 'outline' &&
          'border-2 border-gray-300 hover:bg-gray-050 text-gray-700',
        variant === 'ghost' &&
          'hover:bg-gray-100 text-gray-700',
        
        // Size styles
        size === 'small' && 'px-3 py-1.5 text-sm',
        size === 'medium' && 'px-4 py-2 text-base',
        size === 'large' && 'px-6 py-3 text-lg',
        
        // Icon button
        icon && !children && 'p-2 rounded-lg',
        
        className
      )}
      disabled={disabled}
      aria-disabled={disabled}
      onClick={onClick}
      role="button"
    >
      {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
      {children && (
        <span className="ml-2" aria-hidden={icon ? 'true' : 'false'}>
          {children}
        </span>
      )}
    </button>
  );
}