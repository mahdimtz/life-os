import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <input
        className={clsx(
          'w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-text',
          'placeholder:text-muted',
          'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
          'transition-all duration-200',
          error && 'border-danger focus:ring-danger/30 focus:border-danger',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <textarea
        className={clsx(
          'w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-text',
          'placeholder:text-muted resize-none',
          'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
          'transition-all duration-200',
          error && 'border-danger focus:ring-danger/30 focus:border-danger',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <select
        className={clsx(
          'w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-text',
          'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
          'transition-all duration-200 cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
