import * as React from 'react';
import { cn } from '../../utils';
import { Link } from 'react-router-dom';
import placeholder from '../assets/placeholder.png';
import { ScrollLabel } from './ScrollLabel';
import { ASSET, FILE } from '../../../middleware/ApiClients';
import ApiError from '../../../middleware/api/ApiError';
import { AssetTag } from './AssetTag';
import { useTranslation } from '../provider';
import { BrowserRoutes } from '../../../global/BrowserRoutes';
import LoadModelPreviewImage from '../../../middleware/actions/LoadModelPreviewImage';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

interface ModelPreviewProps {
  className?: string;
  id: number;

  name: string;
  width: number;
  height: number;
  tags?: string[];
}

/**
 * Is a preview for a Model/texture
 * supports an Image, name and tags
 * tags are limited to 8, if more is passed there will be ...and tags.length-8 more shown instead
 */
export const ModelPreview = React.forwardRef<HTMLDivElement, ModelPreviewProps>(
  ({ className, name, id, tags, width, height, ...props }, ref) => {
    const t = useTranslation('ui.model_preview');

    const UserData = useSelector((state: RootState) => state.User);

    const [imageUrl, setImageUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
      (async () => {
        const imageUrl = await LoadModelPreviewImage(id, UserData.auth.clearance);
        setImageUrl(imageUrl);
      })();
    }, [id, UserData.auth]);

    return (
      <Link
        to={BrowserRoutes.ModelDetail + id}
        className="no-underline text-text-950 rounded-lg group transition-all duration-300 hover:scale-[1.02]"
      >
        <div
          className={cn(className, 'flex flex-col items-center mb-2 bg-bg-50 border border-ui-border rounded-lg overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.1)]')}
          style={{ width: `${width}px`, height: `${height}px` }}
          ref={ref}
          {...props}
        >
          <div className="w-[90%] grow mt-2 rounded-md overflow-hidden relative">
            <img
              src={imageUrl === null ? placeholder : imageUrl}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              alt={name}
            />
          </div>
          <div className="w-[90%] py-2">
            <ScrollLabel size="sm" className="text-left font-bold">
              {name}
            </ScrollLabel>
            <div className="flex flex-row flex-wrap justify-start font-light text-xs text-text-500 mt-1">
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
