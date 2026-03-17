import * as React from 'react';
import { cn } from '../../utils';
import { Link } from 'react-router-dom';
import { useToast, useTranslation, useResponsive } from '../../hooks';
import { useCheckClearance } from '../../auth';
import { CLEARANCE } from '../../../store/types';
import { BrowserRoutes } from '../../../global/BrowserRoutes';

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'borderless' | 'bordered';
  children?: React.ReactNode;
}

export const Footer: React.FC<FooterProps> = ({
  className,
  variant = 'borderless',
  children,
  ...props
}) => {
  const t = useTranslation('ui.footer');

  const { isDesktop } = useResponsive();
  const { show } = useToast();
  const { hasClearance } = useCheckClearance();

  const handleAdminClick = (e: React.MouseEvent) => {
    if (!hasClearance(CLEARANCE.ADMIN)) {
      e.preventDefault(); // Stop navigation
      show({
        variant: 'error',
        title: t('no_clearance'),
      });
    }
  };

  return (
    <footer
      className={cn(
        'flex flex-row items-center bg-bg-100 py-3',
        variant === 'bordered' ? 'border-t border-ui-border' : 'w-full',
        isDesktop ? 'justify-end' : 'justify-center',
        className
      )}
      {...props}
    >
      {children}
      <nav className={cn("flex flex-row justify-center", isDesktop && "mr-32")}>
        <Link to={BrowserRoutes.About} className="text-xl hover-underline-animation no-underline text-text-950">
          {t('about')}
        </Link>
        <Link
          onClick={handleAdminClick}
          to={hasClearance(CLEARANCE.ADMIN) ? (BrowserRoutes.ModelManage + 'upload') : '#'}
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