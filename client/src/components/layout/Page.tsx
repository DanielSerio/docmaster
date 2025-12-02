import type { AreaHTMLAttributes } from "react";

export interface PageProps extends Omit<AreaHTMLAttributes<HTMLAreaElement>, 'id'> { }

export function Page({ children, ...props }: PageProps) {
  return (
    <main id="page" {...props}>
      {children}
    </main>
  );
}