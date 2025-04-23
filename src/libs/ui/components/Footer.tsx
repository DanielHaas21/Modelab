import * as React from 'react';
import { cn } from '../../utils';
import { Link } from 'react-router-dom';
import { cva, type VariantProps } from 'class-variance-authority';

const FooterVariants = cva('', {
  variants: {
    variant: {
      borderless: '',
      bordered: '',
    },
  },
  defaultVariants: {
    variant: 'bordered',
  },
});

type FooterVariantProps = VariantProps<typeof FooterVariants>;

interface FooterProps extends FooterVariantProps {
  className?: string;
  children?: React.ReactNode[];
}

export const Footer: React.FC<FooterProps> = ({ className, variant, children, ...props }) => {
  return (
    <footer
      className={cn(
        variant,
        className,
        'd-flex flex-row justify-content-end align-items-center bg-light'
      )}
      {...props}
    >
      {children}
      <nav className="d-flex flex-row justify-content-center  mr-8">
        <Link to="/About" className="fs-2 hover-underline-animation text-decoration-none text-dark">
          About
        </Link>
        <Link
          to="/"
          className="fs-2 hover-underline-animation text-decoration-none text-dark middle-link"
        >
          Upload Assets
        </Link>
        <Link to="/" className="fs-2 hover-underline-animation text-decoration-none text-dark">
          Home
        </Link>
      </nav>
    </footer>
  );
};
// add actual routes in the future
