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
        'flex flex-row items-center bg-bg-100',
        isDesktop ? 'justify-end' : 'justify-center',
        'py-3 border-t border-ui-border'
      )}
      {...props}
    >
      {children}
      <nav className={cn("flex flex-row justify-center", isDesktop && "mr-32")}>
        <Link to="/about" className="fs-2 hover-underline-animation no-underline text-text-950">
          About
        </Link>
        <Link
          onClick={NotifyUser}
          to={User.isAuthenticated ? (User.user?.clearance == 2 ? '/manage/upload' : '') : ''}
          className="fs-2 hover-underline-animation no-underline text-text-950 middle-link"
        >
          Upload Assets
        </Link>
        <Link to="/" className="fs-2 hover-underline-animation no-underline text-text-950">
          Home
        </Link>
      </nav>
    </footer>
  );
};
// add actual routes in the future
