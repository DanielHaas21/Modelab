import * as React from 'react';
import { ModelPreview } from './ModelPreview';
import { Label } from './Label';
import { Preloader } from './Preloader';
import { InfiniteScroll } from './InfiniteScroll';
import { useTranslation } from '../../hooks';
import { AssetModel, AssetQueries } from '../../../middleware/types/models';
import { BrowserSearchAction } from '../../../middleware/types/actions';

interface BrowserResultProps {
  assetQueires: AssetQueries;
  search: BrowserSearchAction;
}

interface Results {
  assets: AssetModel[];
  page: number;
  hasMore: boolean;
}

export const BrowserResults: React.FC<BrowserResultProps> = ({ assetQueires, search }) => {
  const loadPerPage = 8; // Assets per page
  const previewWidth = 350;
  const previewHeight = 250;

  const t = useTranslation('ui.browser_results');

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [results, setResults] = React.useState<Results>({
    assets: [],
    hasMore: true,
    page: 0,
  });

  const requestVersion = React.useRef(0);

  React.useEffect(() => {
    requestVersion.current += 1;
    const currentVersion = requestVersion.current;

    setResults({
      assets: [],
      hasMore: true,
      page: 0,
    });

    const initialLoad = async () => {
      setIsLoading(true);
      const result = await search({
        pagination: { page: 0, count: loadPerPage },
        queries: assetQueires
      });

      if (currentVersion === requestVersion.current) {
        const { assets, pagination } = result;
        const hasMore = 0 < pagination.pageCount - 1;
        setResults({
          assets,
          page: hasMore ? 1 : 0,
          hasMore,
        });
        setIsLoading(false);
      }
    };

    initialLoad();
  }, [assetQueires]);

  // const fetchPage = async (page: number, query?: SearchQuery): Promise<FetchResult | undefined> => {
  //   try {
  //     return await fetchAssets(query, page, loadPerPage);
  //   } catch (err) {
  //     if (err instanceof ApiError) {
  //       console.error('Failed to fetch assets', err);
  //     } else {
  //       throw err;
  //     }
  //     return undefined;
  //   }
  // };

  const loadMore = async () => {
    if (!results.hasMore || isLoading) return;

    const currentVersion = requestVersion.current;
    setIsLoading(true);

    const result = await search({
      pagination: { page: results.page, count: loadPerPage },
      queries: assetQueires
    });

    if (currentVersion !== requestVersion.current) return;

    if (result) {
      const { assets, pagination } = result;
      setResults((prev) => {
        const isLastPage = pagination.page >= pagination.pageCount - 1;
        return {
          assets: [...prev.assets, ...assets],
          page: pagination.page + 1,
          hasMore: !isLastPage,
        };
      });
    }
    setIsLoading(false);
  };

  return (
    <InfiniteScroll
      className="xl:w-5/6 lg:w-3/4 w-full h-full grow p-4"
      hasMore={results.hasMore}
      itemCount={results.assets.length}
      loadMore={loadMore}
      loader={<Label className="w-full text-center py-4">{t('loading')}</Label>}
    >
      {results.assets.length === 0 && !isLoading && (
        <Label className="w-full text-center py-10 opacity-50">{t('no_assets')}</Label>
      )}
      <section className="grid justify-center justify-items-center gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.assets.map((result) => (
          <React.Suspense key={`${requestVersion.current}-${result.id}`} fallback={<Preloader />}>
            <ModelPreview
              asset={result}
              width={previewWidth}
              height={previewHeight}
            />
          </React.Suspense>
        ))}
      </section>
    </InfiniteScroll>
  );
};