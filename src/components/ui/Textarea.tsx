import clsx from 'clsx';
import { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          'w-full rounded-xl bg-surface-hover border border-border px-4 py-3 text-sm text-text placeholder:text-muted',
          'focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40',
          'transition-colors resize-none',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
