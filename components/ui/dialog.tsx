import { clsx } from 'clsx';
import { ReactNode } from 'react';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  children?: ReactNode;
}

export function Dialog({ open, onOpenChange, className, children }: DialogProps) {
  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black/50 backdrop-blur-sm',
        { 'opacity-0 pointer-events-none': !open },
        className
      )}
      role="dialog"
      aria-modal={open}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  );
}

export interface DialogContentProps {
  className?: string;
  children?: ReactNode;
}

export function DialogContent({ className, children }: DialogContentProps) {
  return (
    <div
      className={clsx(
        'relative bg-white dark:bg-gray-900 rounded-xl p-6 max-w-5xl w-full',
        'focus:outline-none',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface DialogHeaderProps {
  className?: string;
  children?: ReactNode;
}

export function DialogHeader({ className, children }: DialogHeaderProps) {
  return (
    <header
      className={clsx(
        'flex flex-col gap-2 mb-4',
        'border-b border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {children}
    </header>
  );
}

export interface DialogTitleProps {
  className?: string;
  children?: ReactNode;
}

export function DialogTitle({ className, children }: DialogTitleProps) {
  return (
    <h2
      className={clsx(
        'text-2xl font-semibold text-gray-900 dark:text-gray-100',
        className
      )}
    >
      {children}
    </h2>
  );
}