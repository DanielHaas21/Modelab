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
        <main className="d-flex flex-column overflow-hidden justify-content-between bg-black h-86-vh bg-grid">
          <Label className={cn("slide-in-text text-white kanit-light text-left w-100 fs-10 glowing lts-3", isDesktop ? "ms-13 mt-5" : "text-center")}>
            Welcome to Modelab
          </Label>
          <div className="d-flex flex-row w-100 h-84-vh">
            {isDesktop && (
              <section className="d-flex flex-row justify-content-center overflow-hidden">
                <div className="w-70 h-100 d-flex justify-content-center align-items-end">
                  {loading ? ( // Conditionally render Preloader while image is loading
                    <Preloader />
                  ) : (
                    <CoverImage className="w-100 object-fit-contain zoom-120 ms-7" size={size} />
                  )}
                </div>
              </section>
            )}
            <section className={cn("d-flex flex-row justify-content-center h-100", isDesktop ? "mr-5" : "w-100")}>
              <div className="d-flex flex-column align-items-center justify-content-evenly mt-5 rounded-4 w-350-px h-50-vh p-2 bg-light fade-in shadowed">
                <div className="d-flex flex-column align-items-center justify-content-between">
                  <Button
                    className="justify-content-center"
                    font="regular"
                    variant="primary"
                    rounding="md"
                    size="md"
                  >
                    <FontAwesomeIcon icon={faGoogle} className="mr-1" />
                    Sign in
                  </Button>
                  <p className="lts-3 fs-2">For all features</p>
                </div>
                <div className="d-flex justify-content-center align-items-center sep lts-1">
                  <span className="line"></span>
                  <span className="">OR</span>
                  <span className="line"></span>
                </div>
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <Button
                    className="justify-content-center"
                    font="regular"
                    variant="light"
                    rounding="md"
                    size="md"
                  >
                    <Link className="text-dark text-decoration-none" to="/browser">
                      Browse assets
                    </Link>
                  </Button>
                  <p className="lts-3 fs-2">Without downloads</p>
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
