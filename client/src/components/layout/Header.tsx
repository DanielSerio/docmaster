import type { HTMLAttributes } from "react";

export interface HeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> { }

export function Header({ children, ...props }: HeaderProps) {
  return (
    <header id="header" {...props}>
      <h1>Logo</h1>
    </header>
  );
}