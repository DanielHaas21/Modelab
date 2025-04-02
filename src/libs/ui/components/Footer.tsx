import * as React from 'react';
import { cn } from '../../utils';
import { Link } from 'react-router-dom';
interface FooterProps {
  className?: string;
  children?: React.ReactNode[];
}

export const Footer: React.FC<FooterProps> = ({ className, children, ...props }) => {
  return (
    <header
      className={cn(
        { className },
        'd-flex flex-row justify-content-end align-items-center h-6-vh w-100 bg-white'
      )}
      {...props}
    >
      {children}
      <div className="d-flex flex-row justify-content-center mr-8">
        <Link to="/" className="fs-2 hover-underline-animation text-decoration-none text-dark">About</Link>
        <Link to="/" className="fs-2 hover-underline-animation text-decoration-none text-dark middle-link">Upload Assets</Link>
        <Link to="/" className="fs-2 hover-underline-animation text-decoration-none text-dark">Home</Link>
      </div>
    </header>
  );
};
  // add actual routes in the future