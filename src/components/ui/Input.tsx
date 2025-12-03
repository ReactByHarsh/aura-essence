import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, startAdornment, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-primary-900 dark:text-neutral-100">
            {label}
          </label>
        )}
        <div className="relative">
          {startAdornment && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              {startAdornment}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-3 py-2 border border-primary-200 dark:border-primary-800 rounded-md',
              'bg-neutral-50 dark:bg-primary-900',
              'text-primary-900 dark:text-neutral-100',
              'focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent',
              'transition-colors duration-200',
              startAdornment && 'pl-10',
              error && 'border-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';