import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import { Input, ModelPreview, Preloader } from '../../libs/ui/components';

const Browser: React.FC = () => {
  return (
    <BaseLayout bordered={true}>
      <main className="w-100 min-h-84-vh d-flex flex-row justify-content-start main-section">
        <div className="d-flex flex-column">
          <section className="d-flex align-items-center justify-content-center w-100 h-9-vh">
            <Input size="xl" placeholder="Search" className="mt-5"></Input>
          </section>
          <section className="d-grid previews w-80 min-h-75-vh ms-8 mt-4">
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
        </div>
        <aside className="d-flex flex-column align-items-center justify-content-start w-20 min-h-86-vh"></aside>
      </main>
    </BaseLayout>
  );
};

export default Browser;
