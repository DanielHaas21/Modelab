import * as React from 'react';
import { cn } from '../../utils';
import { Link } from 'react-router-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { useResponsive } from '../../hooks/useResponsive';
import { useTranslation } from '../provider';
import { useCheckClearance } from '../../auth';
import { CLEARANCE } from '../../../store/types';
import { BrowserRoutes } from '../../../global/BrowserRoutes';
import { useToast } from './Toast';

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
  const { isDesktop } = useResponsive();
  const t = useTranslation('ui.footer');
  const { show } = useToast();
  const { hasClearance } = useCheckClearance();

  const CheckAdminClearance = () => {
    if (!hasClearance(CLEARANCE.ADMIN)) {
      show({
        variant: 'error',
        title: t('no_clearance'),
      });
    }
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
        <Link to={BrowserRoutes.About} className="text-xl hover-underline-animation no-underline text-text-950">
          {t('about')}
        </Link>
        <Link
          onClick={CheckAdminClearance}
          to={hasClearance(CLEARANCE.ADMIN) ? (BrowserRoutes.ModelManage + 'upload') : ''}
          className="text-xl hover-underline-animation no-underline text-text-950 mx-[10px] px-[10px] border-x border-ui-border"
        >
          {t('upload_assets')}
        </Link>
        <Link to={BrowserRoutes.LandingPage} className="text-xl hover-underline-animation no-underline text-text-950">
          {t('home')}
        </Link>
      </nav>
    </footer>
  );
};
// add actual routes in the future
