import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import { Input, ModelPreview, Preloader } from '../../libs/ui/components';

const Browser: React.FC = () => {
  const previewsCol = `col-xl-10 col-8`;
  const filtersCol = `col-xl-2 col-4`;

  return (
    <BaseLayout bordered={true}>
      <main className="w-100 min-h-84-vh d-flex flex-row justify-content-start main-section">
        <div className="ms-8 d-flex flex-column w-100">
          <div className="row w-100">
            <section
              className={
                previewsCol + ' px-0 d-flex align-items-center justify-content-center h-9-vh'
              }
            >
              <Input size="xl" placeholder="Search" className="mt-5"></Input>
            </section>
          </div>
          <div className="row w-100">
            <section className={previewsCol + ' d-flex flex-wrap previews mx-0 min-h-75-vh mt-4'}>
              <React.Suspense fallback={<Preloader></Preloader>}>
                <ModelPreview
                  name="test"
                  tags={[
                    'test',
                    'test',
                    'test',
                    'test',
                    'test',
                    'test',
                    'test',
                    'test',
                    'test',
                    'test',
                    'test',
                    'test',
                    'test',
                    'test',
                    'test',
                  ]}
                ></ModelPreview>
                <ModelPreview name="test"></ModelPreview>
                <ModelPreview name="test"></ModelPreview>
                <ModelPreview name="test"></ModelPreview>
                <ModelPreview name="test"></ModelPreview>
                <ModelPreview name="test"></ModelPreview>
              </React.Suspense>
            </section>
            <aside
              className={
                filtersCol +
                ' d-flex align-items-center justify-content-start min-h-86-vh bg-primary'
              }
            ></aside>
          </div>
        </div>
      </main>
    </BaseLayout>
  );
};

export default Browser;
