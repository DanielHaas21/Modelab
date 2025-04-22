import * as React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components';
import { MessageWrapper } from '../components';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface ModelDetailProps {
  children?: React.ReactNode;
  image?: React.ReactElement;
  bordered: boolean;
}

export const ModelDetailLayout: React.FC<ModelDetailProps> = ({
  children,
  image,
  bordered = true,
}) => {
  return (
    <>
      <Header className={bordered ? 'bordered-h icon-rel' : 'w-100'}></Header>
      <main className="w-100 min-h-86-vh d-flex">
        <div className="d-flex flex-column w-50">
          <section className="d-flex align-items-center justify-content-start w-100 h-9-vh">
            <Link className="text-decoration-none ms-6 mt-5" to="/Browser">
              <Button>
                <FontAwesomeIcon className="mr-3" icon={faArrowLeft}></FontAwesomeIcon>Go back
              </Button>
            </Link>
          </section>
          <section className="d-flex flex-column ms-8 mt-5">{children}</section>
        </div>
        <aside className="d-flex flex-column align-items-center justify-content-start w-50 min-h-86-vh">
          {image}
        </aside>
      </main>
      <Footer className={bordered ? 'bordered-f' : 'w-100'}></Footer>
      <MessageWrapper></MessageWrapper>
    </>
  );
};
