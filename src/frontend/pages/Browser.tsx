import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import { Input, ModelPreview, Preloader } from '../../libs/ui/components';
import { BrowserFilters } from '../../libs/ui/components/BrowserFilters';

const Browser: React.FC = () => {
  const previewsCol = `col-xl-10 col-8`;

  return (
    <BaseLayout bordered={true}>
      <main className="w-100 min-h-84-vh d-flex flex-row justify-content-start main-section">
        <div className="ms-8 d-flex flex-column w-100">
          <div className="row w-100">
            <section
              className={previewsCol + ' px-0 d-flex align-items-center justify-content-center'}
            >
              <Input
                size="xl"
                placeholder="Search"
                className="mt-5"
                inputGroupBefore={
                  <span className="input-group-text">
                    <i className="fa-solid fa-magnifying-glass fs-2" />
                  </span>
                }
              />
            </section>
          </div>
          <div className="row w-100 h-100 pb-2">
            <section className={previewsCol + ' d-flex flex-wrap previews mx-0 mt-4'}>
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
            <BrowserFilters
              categories={[
                { name: '3D Model', id: 1 },
                { name: '2D Texture', id: 2 },
                { name: 'Audio', id: 3 },
              ]}
              tags={[
                { name: 'Medieval', id: 1 },
                { name: 'C4D', id: 2 },
                { name: 'Maya', id: 3 },
                { name: 'Prop', id: 4 },
                { name: 'FBX', id: 5 },
                { name: 'Unity', id: 6 },
                { name: 'Unity Second Test', id: 7 },
              ]}
            />
          </div>
        </div>
      </main>
    </BaseLayout>
  );
};

export default Browser;
