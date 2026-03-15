import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { ModelDetailImage } from './ModelDetailImage';
import { Preloader } from './Preloader';
import { ModelFileProp } from '../../../middleware/types';

interface ModelDetailImageCarouselProps {
  files: ModelFileProp[];
}

export const ModelDetailImageCarousel = React.forwardRef<HTMLDivElement, ModelDetailImageCarouselProps>(
  ({ files }, ref) => {
    const showableFiles = files.filter((file) => {
      switch (file.type) {
        case '3d':
          return file.model !== null;
        case 'preview':
        case 'image':
        case 'audio':
          return true;
      }
      return false;
    });

    return (
      <div ref={ref}>
        <Carousel className='rounded-4 overflow-hidden bg-primary-500' dynamicHeight={true} showThumbs={false}>
          {showableFiles.map((data) => {
            return (
              <React.Suspense key={data.name} fallback={<Preloader />}>
                <ModelDetailImage
                  key={data.name}
                  file={data}
                />
              </React.Suspense>
            );
          })}
        </Carousel>
      </div>
    );
  }
);
