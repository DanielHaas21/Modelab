import * as React from 'react';
import { cn } from '../../utils';
import { Link } from 'react-router-dom';
import placeholder from '../assets/placeHolder.png';

interface ModelPreviewProps {
  className?: string;
  id?: number; // marked as optional for testing only; should be requiered  
  image?: string; // if left empty placeholder shall be used
  name: string;
  tags?: string[];
  //category : string;  not sure if this one is needed
}

/**
 * Is a preview for a Model/texture
 * supports an Image, name and tags
 * tags are limited to 8, if more is passed there will be ...and tags.length-8 more shown instead
 */
export const ModelPreview = React.forwardRef<HTMLDivElement, ModelPreviewProps>(
  ({ className, image, name, id,tags, ...props }, ref) => {
    return (
      <Link to={"/models/" + (id || null)} className='darken text-decoration-none fade-in-left text-dark rounded-3'> 
       <div
        className={cn(className, 'd-flex flex-column align-items-center w-350-px h-250-px mb-2')}
        ref={ref}
        {...props}
      >
        <img src={image || placeholder} className="rounded-2 w-90 mt-2"></img>
        <h2 className="w-85 text-left kanit-regular fs-6">{name}</h2>
        <div className="w-85 d-flex flex-row flex-wrap justify-content-start kanit-light mb-2">
          {tags?.slice(0, 8).map((tag, index) => (
            <span className="mr-1" key={index}>
              {tag}
            </span>
          ))}
          {Array.isArray(tags) &&
            tags.length > 8 && ( // using tags?. somehow doesnt work
              <span>...and {tags.length - 8} more</span>
            )}
        </div>
      </div>
      </Link>
    );
  }
);
