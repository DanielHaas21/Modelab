import * as React from 'react';
import { cn } from '../../utils';
import darkIcon from '../assets/icon/black/black_logo.svg';
import lightIcon from '../assets/icon/white/white_logo@0.5x.png';
import { UserPopup } from './UserPopup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { Hide, Toggle } from '../../../store/slices/Popup';
import { UserImage } from './UserImage';
import { useTheme } from '../../hooks';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode[];
}

/**
 * The Header component serves as the top navigation bar for the application. It displays the application logo, title, and a user profile image. 
 * When the user clicks on the profile image, it toggles the visibility of the UserPopup component, which contains user-related options. =
 */
export const Header: React.FC<HeaderProps> = ({ className, children, ...props }) => {
  const Dispatch = useDispatch<AppDispatch>();
  const Popup = useSelector((state: RootState) => state.Popup.value);

  const { theme } = useTheme();

  const popupRef = React.useRef<HTMLDivElement>(null);
  const userImageRef = React.useRef<HTMLImageElement>(null);

  const ClosePopup = React.useCallback(() => Dispatch(Hide()), [Dispatch]);
  const TogglePopup = React.useCallback(() => Dispatch(Toggle()), [Dispatch]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isOutside =
        popupRef.current &&
        !popupRef.current.contains(target) &&
        userImageRef.current &&
        !userImageRef.current.contains(target);

      const isButtonOrLink = target.closest('button') || target.closest('a'); // Must ignore button or a elements so that popup will stay open even when changing pages

      if (isOutside && !isButtonOrLink) {
        ClosePopup();
      }
    };

    if (Popup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [Popup, ClosePopup]);

  return (
    <>
      <header
        className={cn(
          className,
          'flex flex-row justify-between items-center tracking-wider bg-bg-100 pb-1 border-b border-ui-border'
        )}
        {...props}
      >
        <div className="flex flex-row items-center">
          <img
            src={theme === 'dark' ? lightIcon : darkIcon}
            className="ml-3 w-[60px]"
            alt="logo"
          />
          <h1 className="ml-1 mt-1 text-[2rem] font-extralight">Modelab</h1>
        </div>
        {children}
        <UserImage
          className='mr-5 cursor-pointer'
          onClick={TogglePopup}
        />
      </header>
      {Popup && <UserPopup ref={popupRef} />}
    </>
  );
};
