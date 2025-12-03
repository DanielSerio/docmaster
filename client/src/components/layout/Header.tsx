import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

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
    'px-4 xs:px-0' // layout - spacing
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
        <Button
          variant="ghost"
          size="icon-lg"
          className="px-0 text-muted-foreground hover:text-foreground"
        >
          <Menu style={{ width: 24, height: 24 }} />
        </Button>
      </section>
    </header>
  );
}
