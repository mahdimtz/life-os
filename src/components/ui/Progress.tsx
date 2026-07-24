import clsx from 'clsx';

interface ProgressProps {
  value: number;
  className?: string;
  color?: 'accent' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

const colorStyles = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
};

export function Progress({ value, className, color = 'accent', size = 'md' }: ProgressProps) {
  return (
    <div className={clsx('w-full bg-border rounded-full overflow-hidden', sizeStyles[size], className)}>
      <div
        className={clsx('h-full rounded-full transition-all duration-500 ease-out', colorStyles[color])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
