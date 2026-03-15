import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { ModelDetailImage } from './ModelDetailImage';
import { Preloader } from './Preloader';
import { DetailFile } from '../../../middleware/types';

interface ModelDetailImageCarouselProps {
  files: DetailFile[];
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

    const [selectedItem, setSelectedItem] = useState<number>(0);

    useEffect(() => {
      if (selectedItem >= showableFiles.length) {
        setSelectedItem(Math.max(showableFiles.length - 1, 0));
      }
    }, [files]);

    return (
      <div ref={ref}>
        <Carousel
          className='rounded-2xl overflow-hidden bg-primary-500'
          dynamicHeight={true}
          showThumbs={false}
          selectedItem={selectedItem}
          onChange={(index, _) => {
            setSelectedItem(index);
          }}
        >
          {showableFiles.map((data) => {
            return (
              <React.Suspense key={data.name} fallback={<Preloader />}>
                <div className='min-w-100 min-h-100 flex flex-col'>
                  <ModelDetailImage
                    key={data.name}
                    file={data}
                  />
                </div>
              </React.Suspense>
            );
          })}
        </Carousel>
      </div>
    );
  }
);
