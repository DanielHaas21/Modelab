import * as React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components';
import { MessageWrapper } from '../components';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faPencil, faSave, faUpload } from '@fortawesome/free-solid-svg-icons';
import { ModelFileProps } from '../../types/ModelFileProps';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useResponsive } from '../../hooks/useResponsive';
import { cn } from '../../utils';
import { ModelDetailImageCarousel } from '../components/ModelDetailImageCarousel';

export interface UploadSaveButton {
  type: 'save' | 'upload';
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
  const { isDesktop } = useResponsive();

  return (
    <>
      <Header className={bordered ? 'bordered-h icon-rel' : 'w-100'} />
      <main className={cn("w-100 h-86-vh d-flex pt-5", isDesktop ? "ps-8 pe-8" : "px-4")}>
        <div className={cn("d-flex flex-column", isDesktop ? "w-50" : "w-100")}>
          <section className="d-flex flex-column">{children}</section>
          <section className="d-flex align-items-end justify-content-start w-100 flex-grow-1 row mx-0">
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
                  <FontAwesomeIcon icon={uploadSaveButton.type == 'upload' ? faUpload : faSave} />
                  <span className="w-100">
                    {uploadSaveButton.type == 'upload' ? 'Upload' : 'Save'}
                  </span>
                </Button>
              </div>
            )}
          </section>
        </div>
        {isDesktop && (
          <aside className={cn("d-flex flex-column align-items-center justify-content-center min-h-70-vh overflow-hidden w-50 ms-5")}>
            <ModelDetailImageCarousel image={image ?? []} />
          </aside>
        )}
      </main >
      <Footer className={bordered ? 'bordered-f' : 'w-100'} />
      <MessageWrapper />
    </>
  );
};
