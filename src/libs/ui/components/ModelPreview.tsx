import * as React from 'react';
import { cn } from '../../utils';
import { Link } from 'react-router-dom';
import placeholder from '../assets/placeholder.png';
import { ScrollLabel } from './ScrollLabel';
import { AssetTag } from './AssetTag';
import { ROOT_ROUTES } from '../../../global/routes';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useTranslation } from '../../hooks';
import { ModelPreviewContext } from '../../../middleware/types/actions/modelPreview';
import { loadModelPreviewContext } from '../../../middleware/actions/loadModelPreviewContext';
import { AssetModel } from '../../../middleware/types/models';

interface ModelPreviewProps {
  className?: string;
  asset: AssetModel;
  width: number;
  height: number;
}

/**
 * Is a preview for a Model/texture
 * supports an Image, name and tags
 * tags are limited to 8, if more is passed there will be ...and tags.length-8 more shown instead
 */
export const ModelPreview = React.forwardRef<HTMLDivElement, ModelPreviewProps>(
  ({ className, asset, width, height, ...props }, ref) => {
    const t = useTranslation('ui.model_preview');

    const UserData = useSelector((state: RootState) => state.User);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [modelPreviewContext, setModelPreviewContext] = React.useState<ModelPreviewContext | null>(null);

    React.useEffect(() => {
      (async () => {
        setIsLoading(true);
        try {
          const context = await loadModelPreviewContext(asset.id, UserData.auth.clearance);
          setModelPreviewContext(context);
        } catch (error) {
          console.error('Error fetching preview context:', error);
        }
        setIsLoading(false);
      })();
    }, [asset, UserData.auth]);

    const previewUrl = modelPreviewContext?.previewUrl ?? null;

    const tagsRender = asset.tags.slice(0, 8).map((tag, index) => (
      <AssetTag key={index} name={tag.name} />
    ));
    const andMore = asset.tags.length > 8 && <span>{t('and_more', { count: asset.tags.length - 8 })}</span>;

    return (
      <Link
        to={ROOT_ROUTES.ModelDetail + asset.id}
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
              src={(isLoading || previewUrl === null) ? placeholder : previewUrl}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              alt={asset.name}
            />
          </div>
          <div className="w-[90%] py-2">
            <ScrollLabel size="sm" className="text-left font-bold">
              {asset.name}
            </ScrollLabel>
            <div className="flex flex-row flex-wrap justify-start font-light text-xs text-text-500 mt-1">
              {tagsRender}
              {andMore}
            </div>
          </div>
        </div>
      </Link>
    );
  }
);
