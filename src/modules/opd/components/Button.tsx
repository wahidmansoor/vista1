import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  // Base classes
  const baseClasses = 'rounded-md inline-flex items-center justify-center transition-colors font-medium';

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#004D61] to-[#005B8F] text-white hover:from-[#005B8F] hover:to-[#3B1D74] focus:ring-2 focus:ring-white/50 focus:ring-offset-2 shadow-lg',
    secondary: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 focus:ring-2 focus:ring-white/50 focus:ring-offset-2',
    outline: 'bg-transparent border border-white/30 text-white hover:bg-white/10 hover:border-white/50 focus:ring-2 focus:ring-white/50 focus:ring-offset-2',
    danger: 'bg-red-500/80 backdrop-blur-sm text-white hover:bg-red-600/80 focus:ring-2 focus:ring-red-400/50 focus:ring-offset-2 shadow-lg'
  };

  // State classes
  const stateClasses = (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : '';
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Combine all classes
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    stateClasses,
    widthClasses,
    className
  ].join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {!isLoading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button; 