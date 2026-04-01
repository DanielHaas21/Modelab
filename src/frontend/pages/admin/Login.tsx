import * as React from 'react';
import { useAuth, useResponsive, useTitle, useToast, useTranslation } from '../../../libs/hooks';
import grid from '../../../libs/ui/assets/grid_light.svg';
import { useCheckClearance } from '../../../libs/auth';
import { Button, Label } from '../../../libs/ui/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { CLEARANCE } from '../../../store/types';
import { cn } from '../../../libs/utils';
import { Link, useNavigate } from 'react-router-dom';
import { ADMIN_ROUTES, ROOT_ROUTES } from '../../../global/routes';
import { faUsersGear } from '@fortawesome/free-solid-svg-icons';

const Login: React.FC = () => {
  const t = useTranslation("admin.login");
  useTitle({ type: 'empty' });

  const navigate = useNavigate();
  const { isDesktop } = useResponsive();
  const { googleLogin } = useAuth();
  const { hasClearance } = useCheckClearance();

  const { show } = useToast();

  const handleLogin = () => {
    googleLogin();
    if (hasClearance(CLEARANCE.ADMIN) || hasClearance(CLEARANCE.OVERLORD)) {
      navigate(ROOT_ROUTES.AdminRoot + ADMIN_ROUTES.Panel);
    } else {
      show({
        title: t("not_authorized"),
        description: t("admin_only"),
        variant: "error",
      })
    }
  }

  return (
    <div className="flex flex-col items-center overflow-hidden justify-between h-[100vh] bg-bg-100"
      style={{
        backgroundSize: '140px 140px',
        backgroundImage: `url("${grid}")`
      }}>
      <section className={cn("flex flex-row justify-center h-full items-center")}>
        <div className="flex flex-col items-center justify-between rounded-2xl w-[400px] h-[250px] p-4 bg-bg-100 backdrop-blur-sm animate-in fade-in duration-700 shadowed">
          <Label className='flex items-center gap-3'>{t("title")}<FontAwesomeIcon icon={faUsersGear}></FontAwesomeIcon> </Label>
          <Button
            className="justify-center mb-[60px]"
            font="regular"
            variant="primary"
            rounding="md"
            size="md"
            onClick={handleLogin}
          >
            <FontAwesomeIcon icon={faGoogle} className="mr-2" />
            {t("sign_in")}
          </Button>

        </div>
      </section>
    </div >
  );
};

export default Login;
