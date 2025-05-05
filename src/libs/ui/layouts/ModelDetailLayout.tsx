import * as React from 'react';
import { Header } from '../components/Header';
import { Footer, Preloader } from '../components';
import { MessageWrapper } from '../components';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faPencil, faSave, faUpload } from '@fortawesome/free-solid-svg-icons';
import { ModelFileProps } from '../../types/ModelFileProps';
import { ModelDetailImage } from '../components/ModelDetailImage';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export interface UploadSaveButton {
  id: number | 'upload';
  onClick: () => void;
}

interface ModelDetailProps {
  children?: React.ReactNode;
  image?: ModelFileProps[] | null;
  bordered: boolean;
  goBack?: boolean;
  editButtonId?: number;
  previewButtonId?: number;
  previewButtonOnCLick?: (event: React.MouseEvent<HTMLAnchorElement>) => Promise<void>;
  uploadSaveButton?: UploadSaveButton;
}

export const ModelDetailLayout: React.FC<ModelDetailProps> = ({
  children,
  image = null,
  bordered = true,
  goBack = true,
  editButtonId,
  previewButtonId,
  previewButtonOnCLick,
  uploadSaveButton,
}) => {
  const [canvasKey, setCanvasKey] = React.useState(0); // In the component it watches for context loss and triggers a re-render by changing the key

  const handleContextLoss = React.useCallback((e: Event) => {
    e.preventDefault();
    setCanvasKey((prev) => prev + 1);
  }, []);

  image = image!.filter((data) => data.name.search('.mb') == -1);

  return (
    <>
      <Header className={bordered ? 'bordered-h icon-rel' : 'w-100'} />
      <main className="w-100 h-86-vh d-flex ps-8 pe-8 pt-5">
        <div className="d-flex flex-column w-50">
          <section className="d-flex flex-column mt-5">{children}</section>
          <section className="d-flex align-items-end justify-content-start w-100 flex-grow-1 row">
            {goBack && (
              <Link className="text-decoration-none col-6" to="/browser">
                <Button variant="light" className="justify-content-between w-100">
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span className="w-100">Back</span>
                </Button>
              </Link>
            )}
            {editButtonId !== undefined && (
              <Link className="text-decoration-none col-6" to={'/manage/' + editButtonId}>
                <Button variant="light" className="justify-content-between w-100">
                  <FontAwesomeIcon icon={faPencil} />
                  <span className="w-100">Edit</span>
                </Button>
              </Link>
            )}
            {previewButtonId !== undefined && (
              <Link
                className="text-decoration-none col-6"
                onClick={previewButtonOnCLick}
                to={'/models/' + previewButtonId}
              >
                <Button variant="light" className="justify-content-between w-100">
                  <FontAwesomeIcon icon={faEye} />
                  <span className="w-100">Preview</span>
                </Button>
              </Link>
            )}
            {uploadSaveButton !== undefined && (
              <div className="col-6">
                <Button
                  variant="light"
                  className="justify-content-between w-100"
                  onClick={uploadSaveButton.onClick}
                >
                  <FontAwesomeIcon icon={uploadSaveButton.id == 'upload' ? faUpload : faSave} />
                  <span className="w-100">
                    {uploadSaveButton.id == 'upload' ? 'Upload' : 'Save'}
                  </span>
                </Button>
              </div>
            )}
          </section>
        </div>
        <aside className="d-flex flex-column align-items-center justify-content-center w-50 min-h-70-vh overflow-hidden">
          {image === null ? (
            <div className="bg-primary rounded-4 h-70 w-90 d-flex align-items-center justify-content-center" />
          ) : (
            <Carousel className="ms-6">
              {image.map((data, index) => (
                <React.Suspense fallback={<Preloader />}>
                  <ModelDetailImage
                    key={index}
                    image={image[index]}
                    canvasKey={canvasKey}
                    onContextLoss={handleContextLoss}
                  />
                </React.Suspense>
              ))}
            </Carousel>
          )}
        </aside>
      </main>
      <Footer className={bordered ? 'bordered-f' : 'w-100'} />
      <MessageWrapper />
    </>
  );
};
