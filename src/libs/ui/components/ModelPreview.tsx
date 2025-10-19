import * as React from 'react';
import { cn } from '../../utils';
import { Link } from 'react-router-dom';
import placeholder from '../assets/placeholder.png';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { Add } from '../../../store/slices/Message';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { ScrollLabel } from './ScrollLabel';
import { ASSET, FILE } from '../../../middleware/ApiClients';
import ApiError from '../../../middleware/api/ApiError';

interface ModelPreviewProps {
  className?: string;
  id: number;
  name: string;
  width: number;
  height: number;
  tags?: string[];
}

const imageTypes = [
  'image/png', // PNG
  'image/jpeg', // JPG, JPEG
  'image/gif', // GIF
  'image/svg+xml', // SVG
  'image/webp', // WEBP
  'image/tiff', // TIFF
  'image/bmp', // BMP
];

/**
 * Is a preview for a Model/texture
 * supports an Image, name and tags
 * tags are limited to 8, if more is passed there will be ...and tags.length-8 more shown instead
 */
export const ModelPreview = React.forwardRef<HTMLDivElement, ModelPreviewProps>(
  ({ className, name, id, tags, width, height, ...props }, ref) => {
    const User = useSelector((state: RootState) => state.User);
    const Dispatch = useDispatch<AppDispatch>();

    const CheckLogin = () => {
      if (!User.isAuthenticated) {
        Dispatch(Add({ variant: 'Info', message: 'You must log in order to use this function' }));
      }
    };

    const [imageUrl, setImageUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
      const fetchPreview = async () => {
        try {
          const { files } = await ASSET.get_files(id);
          return files.find((file) => file.isPreview && imageTypes.includes(file.type));
        } catch (err) {
          if (err instanceof ApiError) {
            console.error('Failed to fetch files', err);
          } else {
            throw err;
          }
        }
      };

      const loadImage = async () => {
        const preview = (await fetchPreview()) ?? null;
        if (preview == null) return;

        setImageUrl(FILE.getURL(preview.id));
      };

      loadImage();
    }, [id]);

    return (
      <Link
        onClick={CheckLogin}
        to={User.isAuthenticated ? '/models/' + (id || null) : '/Browser'}
        className="darken text-decoration-none fade-in-left text-dark rounded-3"
      >
        <div
          className={cn(className, 'd-flex flex-column align-items-center mb-2', `w-${width}-px h-${height}-px`)}
          ref={ref}
          {...props}
        >
          <div className="w-90 bg-primary flex-grow-1 rounded-2 mt-2 overflow-hidden">
            <img
              src={imageUrl === null ? placeholder : imageUrl}
              className="object-fit-cover w-100 h-100"
            />
          </div>
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
