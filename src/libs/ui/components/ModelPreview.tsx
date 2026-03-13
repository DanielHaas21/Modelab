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
import { AssetTag } from './AssetTag';
import { useTranslation } from '../provider';

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
    const t = useTranslation('ui.model_preview');

    const CheckLogin = () => {
      if (!User.isAuthenticated) {
        Dispatch(Add({ variant: 'Info', message: t('login_required') }));
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
        className="no-underline text-text-950 rounded-lg group transition-all duration-300 hover:scale-[1.02]"
      >
        <div
          className={cn(className, 'flex flex-col items-center mb-2 bg-bg-50 border border-ui-border rounded-lg overflow-hidden shadowed-black')}
          style={{ width: `${width}px`, height: `${height}px` }}
          ref={ref}
          {...props}
        >
          <div className="w-[90%] flex-grow mt-2 rounded-md overflow-hidden relative">
            <img
              src={imageUrl === null ? placeholder : imageUrl}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              alt={name}
            />
          </div>
          <div className="w-[90%] py-2">
            <ScrollLabel size="sm" className="text-left kanit-bold">
              {name}
            </ScrollLabel>
            <div className="flex flex-row flex-wrap justify-start kanit-light text-xs text-text-500 mt-1">
              {tags?.slice(0, 8).map((tag, index) => (
                <AssetTag key={index} name={tag} />
              ))}
              {Array.isArray(tags) && tags.length > 8 && <span>{t('and_more', { count: tags.length - 8 })}</span>}
            </div>
          </div>
        </div>
      </Link>
    );
  }
);
