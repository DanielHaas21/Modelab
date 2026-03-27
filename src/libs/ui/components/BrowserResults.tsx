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

  const getResults = React.useCallback(async (page: number, assetQueires: AssetQueries, previous?: Results): Promise<Results> => {
    try {
      const result = await search({
        pagination: { page: page, count: loadPerPage },
        queries: assetQueires
      });

      const { assets, pagination } = result;
      const hasMore = 0 < pagination.pageCount - 1;

      if (previous !== undefined) {
        const isLastPage = result.pagination.page >= pagination.pageCount - 1;
        return {
          assets: [...previous.assets, ...assets],
          page: pagination.page + 1,
          hasMore: !isLastPage,
        };
      } else {
        return {
          assets,
          page: hasMore ? 1 : 0,
          hasMore,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        assets: [],
        page: 0,
        hasMore: false,
      };
    }
  }, [search]);

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
      const results = await getResults(0, assetQueires);
      if (currentVersion === requestVersion.current) {
        setResults(results);
      }
      setIsLoading(false);
    };

    initialLoad();
  }, [assetQueires, getResults]);

  const loadMore = React.useCallback(async () => {
    if (!results.hasMore || isLoading) return;

    const currentVersion = requestVersion.current;

    setIsLoading(true);

    const result = await getResults(results.page, assetQueires, results);
    if (currentVersion !== requestVersion.current) return;
    setResults(result);
    setIsLoading(false);
  }, [getResults, assetQueires, isLoading, results]);

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