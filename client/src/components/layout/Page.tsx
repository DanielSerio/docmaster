import type { HTMLAttributes } from 'react';

export interface PageProps extends Omit<HTMLAttributes<HTMLAreaElement>, 'id'> {}

export function Page({ children, ...props }: PageProps) {
  return (
    <main
      id="page"
      {...props}
    >
      <section className="container mx-auto px-4">{children}</section>
    </main>
  );
}
