import * as React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components';
import { MessageWrapper } from '../components';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEye, faPencil, faSave, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useResponsive } from '../../hooks/useResponsive';
import { cn } from '../../utils';
import { ModelDetailImageCarousel } from '../components/ModelDetailImageCarousel';
import { BrowserRoutes } from '../../../global/BrowserRoutes';
import { DetailFile } from '../../../middleware/types';

export interface UploadSaveButton {
  type: 'save' | 'upload';
  onClick: () => void;
}

export interface DeleteButton {
  id: number;
  onClick: () => void;
}

export interface EditButton {
  id: number;
}

export interface PreviewButton {
  id: number;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => Promise<void>;
}

interface ModelDetailProps {
  children?: React.ReactNode;
  files?: DetailFile[] | null;
  bordered: boolean;
  goBack?: boolean;
  editButton?: EditButton;
  previewButton?: PreviewButton;
  uploadSaveButton?: UploadSaveButton;
  deleteButton?: DeleteButton;
}

export const ModelDetailLayout: React.FC<ModelDetailProps> = ({
  children,
  files = null,
  bordered = true,
  goBack = true,
  editButton,
  previewButton,
  uploadSaveButton,
  deleteButton,
}) => {
  const { isDesktop } = useResponsive();

  return (
    <>
      <Header className={'h-[8vh] ' + (bordered ? 'border-b border-ui-border' : 'w-full')} />
      <main className={cn("w-full h-[86vh] flex items-center overflow-hidden", isDesktop ? "px-32" : "px-4")}>
        <div className={cn("flex flex-col h-full py-10", isDesktop ? "w-1/2" : "w-full")}>
          <section className="flex flex-col flex-grow overflow-y-auto custom-scrollbar pr-4">{children}</section>
          <section className="flex items-end justify-start w-full flex-wrap mb-8 mt-4">
            {goBack && (
              <div className="w-1/2 p-1">
                <Link className="no-underline" to={BrowserRoutes.Browser}>
                  <Button variant="light" className="justify-between w-full">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span className="w-full">Back</span>
                  </Button>
                </Link>
              </div>
            )}
            {editButton !== undefined && (
              <div className="w-1/2 p-1">
                <Link className="no-underline" to={BrowserRoutes.ModelManage + editButton.id}>
                  <Button variant="light" className="justify-between w-full">
                    <FontAwesomeIcon icon={faPencil} />
                    <span className="w-full">Edit</span>
                  </Button>
                </Link>
              </div>
            )}
            {previewButton !== undefined && (
              <div className="w-1/2 p-1">
                <Link
                  className="no-underline"
                  onClick={previewButton.onClick}
                  to={BrowserRoutes.ModelDetail + previewButton.id}
                >
                  <Button variant="light" className="justify-between w-full">
                    <FontAwesomeIcon icon={faEye} />
                    <span className="w-full">Preview</span>
                  </Button>
                </Link>
              </div>
            )}
            {uploadSaveButton !== undefined && (
              <div className="w-1/2 p-1">
                <Button
                  variant="light"
                  className="justify-between w-full"
                  onClick={uploadSaveButton.onClick}
                >
                  <FontAwesomeIcon icon={uploadSaveButton.type == 'upload' ? faUpload : faSave} />
                  <span className="w-full">
                    {uploadSaveButton.type == 'upload' ? 'Upload' : 'Save'}
                  </span>
                </Button>
              </div>
            )}
            {deleteButton !== undefined && (
              <div className="w-1/2 p-1">
                <Button
                  variant="accent"
                  className="justify-between w-full"
                  onClick={deleteButton.onClick}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  <span className="w-full">Delete</span>
                </Button>
              </div>
            )}
          </section>
        </div>
        {isDesktop && (
          <aside className={cn("flex flex-col items-center justify-center min-h-[70vh] overflow-hidden w-1/2 ml-10")}>
            <div className="w-full h-full overflow-hidden">
              <ModelDetailImageCarousel files={files ?? []} />
            </div>
          </aside>
        )}
      </main >
      <Footer className={'h-[6vh] ' + (bordered ? 'border-t border-ui-border' : 'w-full')} />
      <MessageWrapper />
    </>
  );
};
