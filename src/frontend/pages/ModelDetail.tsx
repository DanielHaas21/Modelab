import * as React from 'react';
import { ModelDetailLayout } from '../../libs/ui/layouts/ModelDetailLayout';
import { Button } from '../../libs/ui/components/Button';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ModelDetail: React.FC = () => {
  return (
    <ModelDetailLayout bordered={true}>
      <main className="w-100 min-h-86-vh d-flex">
        <div className="d-flex flex-column w-50">
          <section className="d-flex align-items-center justify-content-start w-100 h-9-vh">
            <Link className="text-decoration-none ms-6 mt-5" to="/Browser">
              <Button>
                <FontAwesomeIcon className="mr-3" icon={faArrowLeft}></FontAwesomeIcon>Go back
              </Button>
            </Link>
          </section>
          <section className="d-grid previews w-100 min-h-75-vh ms-8 mt-4"></section>
        </div>
        <aside className="d-flex flex-column align-items-center justify-content-start w-50 min-h-86-vh"></aside>
      </main>
    </ModelDetailLayout>
  );
};

export default ModelDetail;
