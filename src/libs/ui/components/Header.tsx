import * as React from 'react';
import { cn } from '../../utils';
import darkIcon from '../assets/icon/black/black_logo.svg';
import lightIcon from '../assets/icon/white/white_logo@0.5x.png';
import userIconLight from '../assets/user-circle-light.svg';
import userIconDark from '../assets/user-circle-dark.svg';
import { UserPopup } from './UserPopup';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { Hide, Toggle } from '../../../store/slices/Popup';

interface HeaderProps {
  className?: string;
  children?: React.ReactNode[];
}

export const Header: React.FC<HeaderProps> = ({ className, children, ...props }) => {
  const Dispatch = useDispatch<AppDispatch>();
  const Mode = useSelector((state: RootState) => state.Mode.value);
  const UserAuthenticated = useSelector((state: RootState) => state.User.isAuthenticated);
  const Popup = useSelector((state: RootState) => state.Popup.value);
  const popupRef = React.useRef<HTMLDivElement>(null);
  const userImageRef = React.useRef<HTMLImageElement>(null);

  const ClosePopup = () => Dispatch(Hide());
  const TogglePopup = () => Dispatch(Toggle());

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
  }, [Popup]);

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
            src={Mode === 'dark' ? lightIcon : darkIcon}
            className="ml-3 w-[60px]"
            alt="logo"
          />
          <h1 className="ml-1 mt-1 fs-5 kanit-extralight">Modelab</h1>
        </div>
        {children}
        {UserAuthenticated ? (
          <img
            ref={userImageRef}
            onClick={TogglePopup}
            src={Mode === 'dark' ? userIconDark : userIconLight}
            id="userIcon"
            className="w-[60px] mr-5 cursor-pointer hover:opacity-80 transition-opacity"
            alt="user"
          />
        ) : (
          <div className="w-[60px] mr-5" />
        )}
      </header>
      {Popup ? <UserPopup ref={popupRef} /> : null}
    </>
  );
};
