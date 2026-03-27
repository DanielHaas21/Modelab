import * as React from 'react';
import { cn } from '../../utils';
import { Link } from 'react-router-dom';
import { useTranslation, useResponsive } from '../../hooks';
import { useCheckClearance } from '../../auth';
import { Clearance, CLEARANCE } from '../../../store/types';
import { ROOT_ROUTES } from '../../../global/routes';

type NavLinkPosition = 'left' | 'middle' | 'right';

const navLinkPositionOf = (index: number, total: number): NavLinkPosition => {
  if (index <= 0) return 'left';
  if (index >= total - 1) return 'right';
  return 'middle';
};

interface FooterNavLinkProps {
  path: string;
  position: NavLinkPosition;
  children: React.ReactNode;
}

const FooterNavLink: React.FC<FooterNavLinkProps> = ({ path, position, children }) => {
  return (
    <Link
      to={path}
      className={cn(
        'text-xl hover-underline-animation no-underline text-text-950 border-ui-border',
        position === 'left' && 'border-e me-[10px] pe-[10px]',
        position === 'middle' && 'border-e me-[10px] pe-[10px]',
      )}
    >
      {children}
    </Link>
  );
};

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
  const { hasClearance } = useCheckClearance();

  interface NavLinkData extends Omit<FooterNavLinkProps, 'position'> {
    minClearance?: Clearance;
  }

  const footerNavLinks: NavLinkData[] = [
    {
      minClearance: CLEARANCE.ADMIN,
      path: ROOT_ROUTES.ModelManage + 'upload',
      children: t('upload_assets')
    },
    {
      minClearance: CLEARANCE.USER,
      path: ROOT_ROUTES.Browser,
      children: t('browse_assets')
    },
    {
      path: ROOT_ROUTES.About,
      children: t('about')
    },
    {
      path: ROOT_ROUTES.LandingPage,
      children: t('home')
    },
  ];

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
        {footerNavLinks
          .filter((linkData) => {
            if (!hasClearance(linkData.minClearance ?? CLEARANCE.GUEST))
              return false;
            return true;
          })
          .map((linkData, index, arrray) => {
            return (
              <FooterNavLink
                path={linkData.path}
                position={navLinkPositionOf(index, arrray.length)}
              >
                {linkData.children}
              </FooterNavLink>
            );
          })}
      </nav>
    </footer>
  );
};