import type { AreaHTMLAttributes } from "react";

export interface LayoutProps extends Omit<AreaHTMLAttributes<HTMLDivElement>, 'id'> { }

export function Layout({ children, ...props }: LayoutProps) {
  return (
    <div id="layout" {...props}>
      {children}
    </div>
  );
}