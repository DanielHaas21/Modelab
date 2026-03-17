import * as React from 'react';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';
import userIconLight from '../assets/user-circle-light.svg';
import userIconDark from '../assets/user-circle-dark.svg';
import { cn } from '../../utils';
import { useTheme } from '../../hooks';

/**
 * A component for displaying the user's profile image. It retrieves the user's profile picture from the Redux store and displays it. If no profile picture is available, it falls back to a default user icon based on the current theme (light or dark).
 */
export const UserImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => {
    const UserData = useSelector((state: RootState) => state.User);

    const { theme } = useTheme();

    const userImage = UserData.user?.picture
      ? UserData.user?.picture
      : theme === 'dark'
        ? userIconDark
        : userIconLight;

    return <img
      ref={ref}
      src={userImage}
      referrerPolicy="no-referrer"
      alt="User Profile"
      className={cn('w-[60px] h-[60px] rounded-full border-2 border-primary-500/20', className)}
      {...props}
    />;
  });