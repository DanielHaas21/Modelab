import * as React from 'react';
import { CoverImage, Label, Preloader } from '../../libs/ui/components';
import { cn, DecideImageSize } from '../../libs/utils';
import { img } from '../../libs/types/size';
import { BaseLayout } from '../../libs/ui/layouts';
import { Button } from '../../libs/ui/components/Button';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { useResponsive } from '../../libs/hooks/useResponsive';

const LandingPage: React.FC = () => {
  const [size, setSize] = React.useState<img | null>(null);
  const [loading, setLoading] = React.useState(true); // New loading state
  const { isDesktop } = useResponsive();

  React.useEffect(() => {
    const loadImage = async () => {
      setSize(DecideImageSize());
      setLoading(false); // Set loading to false once image is loaded
    };

    loadImage();
  }, []);

  return (
    <React.Suspense fallback={<Preloader />}>
      <BaseLayout bordered={false}>
        <main className="flex flex-col items-center overflow-hidden justify-between bg-ui-bg h-[86vh] bg-grid">
          <Label className={cn("slide-in-text text-ui-text kanit-light text-center w-full fs-10 glowing lts-3 mt-10")}>
            Welcome to Modelab
          </Label>
          <div className="flex flex-row w-full h-[84vh] justify-center items-end">
            {isDesktop && (
              <section className="flex flex-row justify-center overflow-hidden w-1/2">
                <div className="w-full h-full flex justify-center items-center">
                  {loading ? ( // Conditionally render Preloader while image is loading
                    <Preloader />
                  ) : (
                    <CoverImage className="w-full h-full object-contain" size={size} />
                  )}
                </div>
              </section>
            )}
            <section className={cn("flex flex-row justify-center h-full items-center", isDesktop ? "w-1/2" : "w-full")}>
              <div className="flex flex-col items-center justify-around rounded-2xl w-[350px] h-[50vh] p-4 bg-bg-100/90 backdrop-blur-sm animate-in fade-in duration-700 shadowed">
                <div className="flex flex-col items-center justify-between">
                  <Button
                    className="justify-center"
                    font="regular"
                    variant="primary"
                    rounding="md"
                    size="md"
                  >
                    <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                    Sign in
                  </Button>
                  <p className="lts-3 fs-2 mt-2">For all features</p>
                </div>
                <div className="flex justify-center items-center gap-4 lts-1 w-full">
                  <span className="flex-grow h-[1px] bg-ui-border"></span>
                  <span className="text-text-500">OR</span>
                  <span className="flex-grow h-[1px] bg-ui-border"></span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Button
                    className="justify-center"
                    font="regular"
                    variant="light"
                    rounding="md"
                    size="md"
                  >
                    <Link className="text-text-950 no-underline" to="/browser">
                      Browse assets
                    </Link>
                  </Button>
                  <p className="lts-3 fs-2 mt-2">Without downloads</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </BaseLayout>
    </React.Suspense>
  );
};

export default LandingPage;
