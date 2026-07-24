import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-surface border border-border rounded-2xl p-6 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={clsx('text-sm font-semibold text-text-secondary uppercase tracking-wider', className)}>
      {children}
    </h3>
  );
}
