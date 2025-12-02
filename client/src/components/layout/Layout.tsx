import type { HTMLAttributes } from "react";

export interface LayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> { }

export function Layout({ children, ...props }: LayoutProps) {
  return (
    <div id="layout" {...props}>
      {children}
    </div>
  );
}