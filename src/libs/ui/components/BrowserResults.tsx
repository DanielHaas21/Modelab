import * as React from 'react';
import { ModelPreview } from './ModelPreview';
import { Label } from './Label';
import { Preloader } from './Preloader';
import { AssetService, AssetData, PaginatedInfo } from '../../../middleware/api';
import ApiError from '../../../middleware/api/ApiError';
import { InfiniteScroll } from './InfiniteScroll';
import { CategoryOption } from './CategorySelect';
import { useTranslation } from '../provider';
import { TagOption } from './TagSelect';

export interface SearchQuery {
  categories: CategoryOption[];
  tags: TagOption[];
  nameQuery: string;
}

interface AssetResult {
  name: string;
  tags: string[];
  id: number;
}

interface FetchResult {
  assets: AssetResult[];
  info: PaginatedInfo;
}

const fetchAssets = async (
  searchQuery: SearchQuery | undefined,
  page: number,
  count: number
): Promise<FetchResult> => {
  const assetApi = new AssetService();

  const formatResult = (assets: AssetData[], info: PaginatedInfo): FetchResult => {
    return {
      info,
      assets: assets.map((asset) => ({
        name: asset.name,
        tags: asset.tags.map((tag) => tag.name),
        id: asset.id,
      })),
    };
  };

  if (
    !searchQuery ||
    (searchQuery.categories.length === 0 &&
      searchQuery.tags.length === 0 &&
      searchQuery.nameQuery.length === 0)
  ) {
    const { assets, info } = await assetApi.getAll(page, count);
    return formatResult(assets, info);
  }

  const { assets, info } = await assetApi.search({
    page,
    count,
    categoryQuery: searchQuery.categories.length > 0 ? searchQuery.categories.map(c => c.id) : undefined,
    tagQuery: searchQuery.tags.length > 0 ? searchQuery.tags.map(t => t.id) : undefined,
    nameQuery: searchQuery.nameQuery.length > 0 ? searchQuery.nameQuery : undefined,
    descriptionQuery: undefined,
  });
  return formatResult(assets, info);
};

interface BrowserResultProps {
  searchQuery?: SearchQuery;
}

interface Results {
  assets: AssetResult[];
  page: number;
  hasMore: boolean;
}

export const BrowserResults: React.FC<BrowserResultProps> = ({ searchQuery }) => {
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
      const result = await fetchPage(0, searchQuery);

      if (currentVersion === requestVersion.current && result) {
        const { assets, info } = result;
        const hasMore = 0 < info.pageCount - 1;
        setResults({
          assets,
          page: hasMore ? 1 : 0,
          hasMore,
        });
        setIsLoading(false);
      }
    };

    initialLoad();
  }, [searchQuery]);

  const fetchPage = async (page: number, query?: SearchQuery): Promise<FetchResult | undefined> => {
    try {
      return await fetchAssets(query, page, loadPerPage);
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('Failed to fetch assets', err);
      } else {
        throw err;
      }
      return undefined;
    }
  };

  const loadMore = async () => {
    if (!results.hasMore || isLoading) return;

    const currentVersion = requestVersion.current;
    setIsLoading(true);

    const result = await fetchPage(results.page, searchQuery);

    if (currentVersion !== requestVersion.current) return;

    if (result) {
      const { assets, info } = result;
      setResults((prev) => {
        const isLastPage = info.page >= info.pageCount - 1;
        return {
          assets: [...prev.assets, ...assets],
          page: info.page + 1,
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
              name={result.name}
              tags={result.tags}
              id={result.id}
              width={previewWidth}
              height={previewHeight}
            />
          </React.Suspense>
        ))}
      </section>
    </InfiniteScroll>
  );
};