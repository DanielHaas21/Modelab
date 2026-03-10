import * as React from 'react';
import { cn } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import userIconLight from '../assets/user-circle-light.svg';
import userIconDark from '../assets/user-circle-dark.svg';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle, faArrowRightFromBracket, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Label } from './Label';
import { DarkMode, LightMode } from '../../../store/slices/Mode';

interface UserPopupProps {
  className?: string;
}

// wrap buttons in Link when Oauth is implemented
export const UserPopup = React.forwardRef<HTMLDivElement, UserPopupProps>(
  ({ className, ...props }, ref) => {
    const dispatch = useDispatch();
    const UserData = useSelector((state: RootState) => state.User);
    const Mode = useSelector((state: RootState) => state.Mode.value);

    const toggleTheme = () => {
      if (Mode === 'light') {
        dispatch(DarkMode());
      } else {
        dispatch(LightMode());
      }
    };

    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          className,
          'flex flex-col items-center justify-start w-[300px] absolute right-8 top-16 z-[60] bg-bg-100 border border-ui-border rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200'
        )}
      >
        <img
          src={
            UserData.user?.picture
              ? UserData.user?.picture
              : Mode === 'dark'
                ? userIconDark
                : userIconLight
          }
          className="w-[60px] h-[60px] rounded-full border-2 border-primary-500/20 mb-3"
          alt="user profile"
        />
        <Label size="xxs" className="font-medium text-text-950 mb-1">
          {UserData.user?.username || 'Guest User'}
        </Label>
        <p className="text-sm kanit-light text-primary-500 mb-6">{UserData.user?.email || 'guest@modelab.com'}</p>
        
        <div className="flex flex-col w-full gap-2">
          <Button 
            className="w-full justify-center" 
            font_size="sm" 
            variant="light" 
            font="regular"
            onClick={toggleTheme}
          >
            <FontAwesomeIcon icon={Mode === 'light' ? faMoon : faSun} className="mr-2" />
            {Mode === 'light' ? 'Dark Mode' : 'Light Mode'}
          </Button>
          <Button className="w-full justify-center" font_size="sm" variant="light" font="regular">
            <FontAwesomeIcon icon={faShuffle} className="mr-2" />
            Switch account
          </Button>
          <Button
            className="w-full justify-center"
            variant="primary"
            font_size="sm"
            font="regular"
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    );
  }
);
