import React from 'react';
import { cn } from '@/lib/utils';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className, rows = 3, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <textarea
          ref={ref}
          className={cn(
            "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          rows={rows}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea'; 