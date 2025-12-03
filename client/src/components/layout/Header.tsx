import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export interface HeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {}

export function Header({ children, className, ...props }: HeaderProps) {
  const classNames = cn(
    'fixed top-0 left-0 right-0 z-50', // layout - coords
    'h-14 w-full', // layout - size
    'bg-card text-card-foreground border-b', // theme
    className
  );

  const containerClassNames = cn(
    'relative container h-full mx-auto', // layout - size
    'flex items-center justify-between', // layout - position
    'px-4' // layout - spacing
  );

  return (
    <header
      id="header"
      className={classNames}
      {...props}
    >
      <section className={containerClassNames}>
        <a href="/">
          <h1 className="text-xl font-semibold">
            <span className="text-primary">Doc</span>
            <span className="text-muted-foreground">Master</span>
          </h1>
        </a>
      </section>
    </header>
  );
}
