import * as React from 'react';
import { cn } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShuffle, faArrowRightFromBracket, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Label } from './Label';
import { DarkMode, LightMode } from '../../../store/slices/Mode';
import { UserImage } from './UserImage';
import { useTranslation } from '../provider';
import { useCheckClearance } from '../../auth';
import { CLEARANCE } from '../../../store/types';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../../auth/AuthProvider';

interface UserPopupProps {
  className?: string;
}

// wrap buttons in Link when Oauth is implemented
export const UserPopup = React.forwardRef<HTMLDivElement, UserPopupProps>(
  ({ className, ...props }, ref) => {
    const { changeAccount, logout, googleLogin } = useAuth();
    const dispatch = useDispatch();
    const UserData = useSelector((state: RootState) => state.User);
    const Mode = useSelector((state: RootState) => state.Mode.value);
    const t = useTranslation('ui.user_popup');
    const { hasClearance } = useCheckClearance();

    const handleToggleTheme = () => {
      if (Mode === 'light') {
        dispatch(DarkMode());
      } else {
        dispatch(LightMode());
      }
    };

    const handleChangeAccount = () => {
      changeAccount();
    };

    const handleLogout = () => {
      logout();
    };

    const handleLogin = () => {
      googleLogin();
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
        <UserImage className='mb-3' />
        <Label size="xxs" className="font-medium text-text-950 mb-1">
          {UserData.user?.username || t('guest_user')}
        </Label>
        {hasClearance(CLEARANCE.USER)
          ? (
            <p className="text-sm kanit-light text-primary-500 mb-6">{UserData.user?.email || 'guest@modelab.com'}</p>
          )
          : (
            <p className="text-sm kanit-light text-primary-500 mb-6">{t('without_downloads')}</p>
          )
        }

        <div className="flex flex-col w-full gap-2">
          <Button
            className="w-full justify-center"
            font_size="sm"
            variant="light"
            font="regular"
            onClick={handleToggleTheme}
          >
            <FontAwesomeIcon icon={Mode === 'light' ? faMoon : faSun} className="mr-2" />
            {Mode === 'light' ? t('dark_mode') : t('light_mode')}
          </Button>

          {hasClearance(CLEARANCE.USER)
            ? (
              <>
                <Button
                  className="w-full justify-center"
                  font_size="sm"
                  variant="light"
                  font="regular"
                  onClick={handleChangeAccount}
                >
                  <FontAwesomeIcon icon={faShuffle} className="mr-2" />
                  {t('switch_account')}
                </Button>
                <Button
                  className="w-full justify-center"
                  variant="primary"
                  font_size="sm"
                  font="regular"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} className="mr-2" />
                  {t('logout')}
                </Button>
              </>
            )
            : (
              <Button
                className="justify-center"
                font="regular"
                variant="primary"
                rounding="md"
                size="md"
                onClick={handleLogin}
              >
                <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                {t("sign_in")}
              </Button>
            )}
        </div>
      </div>
    );
  }
);
