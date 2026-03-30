import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { ModelDetailImage } from './ModelDetailImage';
import { Preloader } from './Preloader';
import { AssetFile } from '../../../middleware/types/actions';

interface ModelDetailImageCarouselProps {
  files: AssetFile[];
}

/**
 * A carousel component that displays images and previews for a model's detail view. 
 */
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
    }, [files, selectedItem, showableFiles]);

    const filesRender = showableFiles.map((data) => {
      return (
        <React.Suspense key={data.name} fallback={<Preloader />}>
          <div className='w-full h-[50vh] grow flex flex-col'>
            <ModelDetailImage
              key={data.name}
              file={data}
            />
          </div>
        </React.Suspense>
      );
    })

    return (
      <div ref={ref}>
        {showableFiles.length > 1
          ? (
            <Carousel
              swipeable={false}
              className='rounded-2xl overflow-hidden bg-primary-500'
              dynamicHeight={false}
              showThumbs={false}
              selectedItem={selectedItem}
              onChange={(index) => {
                setSelectedItem(index);
              }}
            >
              {filesRender}
            </Carousel>
          )
          : (
            <div
              className='flex justify-center rounded-2xl overflow-hidden bg-primary-500'
            >
              {filesRender}
            </div>
          )
        }
      </div>
    );
  }
);
