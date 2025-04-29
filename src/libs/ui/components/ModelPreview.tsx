import * as React from 'react';
import { cn } from '../../utils';
import { Link } from 'react-router-dom';
import placeholder from '../assets/placeholder.png';
import { Label } from './Label';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { Add } from '../../../store/slices/Message';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { ScrollLabel } from './ScrollLabel';

interface ModelPreviewProps {
  className?: string;
  id?: number; // marked as optional for testing only; should be requiered
  image?: string; // if left empty placeholder shall be used
  name: string;
  tags?: string[];
}

/**
 * Is a preview for a Model/texture
 * supports an Image, name and tags
 * tags are limited to 8, if more is passed there will be ...and tags.length-8 more shown instead
 */
export const ModelPreview = React.forwardRef<HTMLDivElement, ModelPreviewProps>(
  ({ className, image, name, id, tags, ...props }, ref) => {
    const User = useSelector((state: RootState) => state.User);
    const Dispatch = useDispatch<AppDispatch>();

    const CheckLogin = () => {
      if (!User.isAuthenticated) {
        Dispatch(Add({ variant: 'Info', message: 'You must log in order to use this function' }));
      }
    };

    return (
      <Link
        onClick={CheckLogin}
        to={User.isAuthenticated ? '/models/' + (id || null) : '/Browser'}
        className="darken text-decoration-none fade-in-left text-dark rounded-3"
      >
        <div
          className={cn(className, 'd-flex flex-column align-items-center w-350-px h-250-px mb-2')}
          ref={ref}
          {...props}
        >
          <img src={image || placeholder} className="rounded-2 w-90 mt-2"></img>
          <div className="w-85">
            <ScrollLabel size="sm" className="text-left kanit-regular fw-bold">
              {name}
            </ScrollLabel>
            <div className="d-flex flex-row flex-wrap justify-content-start kanit-light mb-2">
              {tags?.slice(0, 8).map((tag, index) => (
                <span className="mr-1" key={index}>
                  {tag}
                </span>
              ))}
              {Array.isArray(tags) && tags.length > 8 && <span>...and {tags.length - 8} more</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  }
);
