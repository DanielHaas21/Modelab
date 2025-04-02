import * as React from 'react';
import { cn } from '../../utils';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode[];
}

export const Header: React.FC<HeaderProps> = ({ className, children, ...props }) => {
  return (
    <header
      className={cn(
        { className },
        'd-flex flex-row justify-content-start align-items-center h-8-vh w-100 lts-2'
      )}
      {...props}
    >
      <h1 className="ms-5 kanit-extralight">Modelab</h1>
      {children}
    </header>
  );
};
