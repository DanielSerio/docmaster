import type { AreaHTMLAttributes } from "react";

export interface HeaderProps extends Omit<AreaHTMLAttributes<HTMLDivElement>, 'id'> { }

export function Header({ children, ...props }: HeaderProps) {
  return (
    <header id="header" {...props}>
      <h1>Logo</h1>
    </header>
  );
}