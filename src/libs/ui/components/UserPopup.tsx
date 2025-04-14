import * as React from 'react';
import { cn } from '../../utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import userIconLight from '../assets/user-circle-light.svg';
import userIconDark from '../assets/user-circle-light.svg';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

interface UserPopupProps {
  className?: string;
}

// wrap buttons in Link when Oauth is implemented
export const UserPopup = React.forwardRef<HTMLDivElement, UserPopupProps>(
  ({ className, ...props }, ref) => {
    const UserData = useSelector((state: RootState) => state.User);
    const Mode = useSelector((state: RootState) => state.Mode.value);
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          className,
          'd-flex flex-column align-items-center justify-content-start w-300-px h-250-px position-absolute bg-light rounded-4 shadowed-black z-1 popup'
        )}
      >
        <div id="polygon" className="bg-light"></div>
        <img
          src={
            UserData.user?.picture
              ? UserData.user?.picture
              : Mode === 'dark'
                ? userIconLight
                : userIconDark
          }
          className="w-60-px"
        ></img>
        <h2 className="kanit-light fs-6 m-0">{UserData.user?.username || 'test'}</h2>
        <p className="m-1 text-info">{UserData.user?.email || 'test email'}</p>
        <Button className="w-80 m-1" font_size="sm" variant="light" font="light">
          <FontAwesomeIcon icon={faShuffle} className="mr-1"></FontAwesomeIcon>Switch account
        </Button>
        <Button className="w-80 justify-content-start" variant="primary" font_size="sm" font="light">
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-4"></FontAwesomeIcon>Logout
        </Button>
      </div>
    );
  }
);
