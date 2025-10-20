import React from 'react';
import { ModelFileProps } from '../../types/ModelFileProps';
import { Carousel } from 'react-responsive-carousel';
import { ModelDetailImage } from './ModelDetailImage';
import { Preloader } from './Preloader';

interface ModelDetailImageCarouselProps {
  image: ModelFileProps[];
}

export const ModelDetailImageCarousel = React.forwardRef<HTMLDivElement, ModelDetailImageCarouselProps>(
  ({ image }, ref) => {
    const hiddenTypes = [
      'application/mathematica',
      'model/mtl',
      'application/zip'
    ];

    image = image!.filter((data) => !hiddenTypes.includes(data.type));

    const [canvasKey, setCanvasKey] = React.useState(0); // In the component it watches for context loss and triggers a re-render by changing the key

    const handleContextLoss = React.useCallback((e: Event) => {
      e.preventDefault();
      setCanvasKey((prev) => prev + 1);
    }, []);

    return (
      <div ref={ref}>
        {image === null ? (
          <div className="bg-primary rounded-4 h-70 w-90 d-flex align-items-center justify-content-center" />
        ) : (
          <Carousel className='w-100 rounded-4 overflow-hidden' dynamicHeight={true} showThumbs={false}>
            {image.map((data) => {
              return (
                <React.Suspense key={data.name} fallback={<Preloader />}>
                  <ModelDetailImage
                    key={data.name}
                    image={data}
                    canvasKey={canvasKey}
                    onContextLoss={handleContextLoss}
                  />
                </React.Suspense>
              );
            })}
          </Carousel>
        )}
      </div>
    );
  }
);
