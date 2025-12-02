import type { HTMLAttributes } from "react";

export interface PageProps extends Omit<HTMLAttributes<HTMLAreaElement>, 'id'> { }

export function Page({ children, ...props }: PageProps) {
  return (
    <main id="page" {...props}>
      {children}
    </main>
  );
}