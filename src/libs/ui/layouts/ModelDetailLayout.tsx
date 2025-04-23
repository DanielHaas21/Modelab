import * as React from 'react';
import { Header } from '../components/Header';
import { Footer, Preloader } from '../components';
import { MessageWrapper } from '../components';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ModelFileProps } from '../../types/ModelFileProps';
import { ModelDetailImage } from '../components/ModelDetailImage';

interface ModelDetailProps {
  children?: React.ReactNode;
  image?: ModelFileProps;
  bordered: boolean;
}

export const ModelDetailLayout: React.FC<ModelDetailProps> = ({
  children,
  image,
  bordered = true,
}) => {
  const [canvasKey, setCanvasKey] = React.useState(0);  // In the component it watches for context loss and triggers a re-render by changing the key

  const handleContextLoss = React.useCallback((e: Event) => {
    e.preventDefault();
    setCanvasKey((prev) => prev + 1);
  }, []);

  return (
    <>
      <Header className={bordered ? 'bordered-h icon-rel' : 'w-100'} />
      <main className="w-100 min-h-86-vh d-flex">
        <div className="d-flex flex-column w-50">
          <section className="d-flex align-items-center justify-content-start w-100 h-9-vh">
            <Link className="text-decoration-none ms-6 mt-5" to="/Browser">
              <Button>
                <FontAwesomeIcon className="mr-3" icon={faArrowLeft} />
                Go back
              </Button>
            </Link>
          </section>
          <section className="d-flex flex-column ms-8 mt-5">{children}</section>
        </div>
        <aside className="d-flex flex-column align-items-center justify-content-start w-50 min-h-86-vh">
          <React.Suspense fallback={<Preloader />}>
            <ModelDetailImage
              image={image!}
              canvasKey={canvasKey}
              onContextLoss={handleContextLoss}
            />
          </React.Suspense>
        </aside>
      </main>
      <Footer className={bordered ? 'bordered-f' : 'w-100'} />
      <MessageWrapper />
    </>
  );
};
