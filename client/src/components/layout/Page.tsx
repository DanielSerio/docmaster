import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface PageProps extends Omit<HTMLAttributes<HTMLAreaElement>, 'id'> {}

export function Page({ children, className, ...props }: PageProps) {
  const classNames = cn('mt-14', 'pt-4 md:pt-6 xl:pt-8', className);

  return (
    <main
      id="page"
      className={classNames}
      {...props}
    >
      <section className="container mx-auto px-4">{children}</section>
    </main>
  );
}
