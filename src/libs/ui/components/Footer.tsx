import * as React from 'react';
import { cn } from '../../utils';
import { Link } from 'react-router-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { Add } from '../../../store/slices/Message';
import { useResponsive } from '../../hooks/useResponsive';

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
  const User = useSelector((state: RootState) => state.User);
  const Dispatch = useDispatch<AppDispatch>();
  const { isDesktop } = useResponsive();

  const NotifyUser = () => {
    User.isAuthenticated
      ? User.user?.clearance == 1
        ? Dispatch(
          Add({
            variant: 'Error',
            message: 'You dont have the requiered clearance for this function',
          })
        )
        : null
      : Dispatch(Add({ variant: 'Info', message: 'You must log in order to use this function' }));
  };

  return (
    <footer
      className={cn(
        variant,
        className,
        'd-flex flex-row align-items-center bg-light',
        isDesktop ? 'justify-content-end' : 'justify-content-center',
        'py-3'
      )}
      {...props}
    >
      {children}
      <nav className={cn("d-flex flex-row justify-content-center", isDesktop && "mr-8")}>
        <Link to="/about" className="fs-2 hover-underline-animation text-decoration-none text-dark">
          About
        </Link>
        <Link
          onClick={NotifyUser}
          to={User.isAuthenticated ? (User.user?.clearance == 2 ? '/manage/upload' : '') : ''}
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
