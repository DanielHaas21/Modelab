import * as React from 'react';
import { CoverImage, ImageSize, Label, Preloader } from '../../libs/ui/components';
import { cn, DecideImageSize } from '../../libs/utils';
import { BaseLayout } from '../../libs/ui/layouts';
import { Button } from '../../libs/ui/components/Button';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useResponsive } from '../../libs/hooks/useResponsive';
import { useTranslation } from '../../libs/ui/provider';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { useCheckClearance } from '../../libs/auth';
import { CLEARANCE } from '../../store/types';
import { BrowserRoutes } from '../../global/BrowserRoutes';
import { useAuth } from '../../libs/auth/AuthProvider';

import grid from '../../libs/ui/assets/grid.svg';

const LandingPage: React.FC = () => {
  const [size, setSize] = React.useState<ImageSize | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true); // New loading state
  const { isDesktop } = useResponsive();
  const { googleLogin } = useAuth();
  const { hasClearance } = useCheckClearance();
  const UserData = useSelector((state: RootState) => state.User);

  const t = useTranslation("pages.home");

  React.useEffect(() => {
    const loadImage = async () => {
      setSize(DecideImageSize());
      setLoading(false); // Set loading to false once image is loaded
    };

    loadImage();
  }, []);

  const handleLogin = () => {
    googleLogin();
  };

  return (
    <React.Suspense fallback={<Preloader />}>
      <BaseLayout bordered={false}>
        <main
          className="flex flex-col items-center overflow-hidden justify-between bg-[#0d0d0d] h-[86vh] bg-grid"
          style={{
            backgroundImage: `url("${grid}")`
          }}
        >
          <Label className={cn("w-full slide-in-text text-white font-light text-center md:text-left ms-0 md:ms-[25%] text-[3.25rem] glowing tracking-[0.3rem] mt-10")}>
            {t("welcome")}
          </Label>
          <div className="flex flex-row w-full h-[84vh] justify-center items-end">
            {isDesktop && (
              <section className="flex flex-row justify-center overflow-hidden w-1/2">
                <div className="w-full h-full flex justify-center items-center">
                  {loading ? ( // Conditionally render Preloader while image is loading
                    <Preloader />
                  ) : (
                    <CoverImage className="w-full h-full object-contain" size={size ?? undefined} />
                  )}
                </div>
              </section>
            )}
            <section className={cn("flex flex-row justify-center h-full items-center ", isDesktop ? "w-1/2" : "w-full")}>
              <div className="flex flex-col items-center justify-around rounded-2xl w-[400px] h-[50vh] p-4 bg-bg-100 md:ms-[100px] mt-[-100px] backdrop-blur-sm animate-in fade-in duration-700 shadowed">
                {(hasClearance(CLEARANCE.USER))
                  ? (
                    <div className="flex flex-col items-center justify-center">
                      <p className="tracking-[0.3rem] text-xl mt-2">{t("hello")} {UserData.user?.username}</p>
                      <Button
                        className="justify-center"
                        font="regular"
                        variant="light"
                        rounding="md"
                        size="md"
                      >
                        <Link className="text-text-950 no-underline" to={BrowserRoutes.Browser}>
                          {t("browse")}
                        </Link>
                      </Button>
                    </div>
                  )
                  : (
                    <>
                      <div className="flex flex-col items-center justify-between">
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
                        <p className="tracking-[0.3rem] text-xl mt-2">{t("features")}</p>
                      </div>
                      <div className="flex justify-center items-center gap-4 tracking-[0.1rem] w-full">
                        <span className="grow h-px bg-ui-border"></span>
                        <span className="text-text-500 uppercase">{t("or")}</span>
                        <span className="grow h-px bg-ui-border"></span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <Button
                          className="justify-center"
                          font="regular"
                          variant="light"
                          rounding="md"
                          size="md"
                        >
                          <Link className="text-text-950 no-underline" to={BrowserRoutes.Browser}>
                            {t("browse")}
                          </Link>
                        </Button>
                        <p className="tracking-[0.3rem] text-xl mt-2">{t("without_downloads")}</p>
                      </div>
                    </>
                  )
                }
              </div>
            </section>
          </div>
        </main>
      </BaseLayout>
    </React.Suspense>
  );
};

export default LandingPage;
