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
      assets: assets.map((asset) => {
        return {
          name: asset.name,
          tags: asset.tags.map((tag) => tag.name),
          id: asset.id,
        };
      }),
    };
  };

  // Get all if no query
  if (
    searchQuery === undefined ||
    (searchQuery.categories.length == 0 &&
      searchQuery.tags.length == 0 &&
      searchQuery.nameQuery.length == 0)
  ) {
    const { assets, info } = await assetApi.getAll(page, count);
    return formatResult(assets, info);
  }

  // Use the search
  const { assets, info } = await assetApi.search({
    page,
    count,
    categoryQuery:
      searchQuery.categories.length > 0
        ? searchQuery.categories.map((category) => category.id)
        : undefined,
    tagQuery: searchQuery.tags.length > 0 ? searchQuery.tags.map((tag) => tag.id) : undefined,
    nameQuery: searchQuery.nameQuery.length > 0 ? searchQuery.nameQuery : undefined,
    descriptionQuery: undefined,
  });
  return formatResult(assets, info);
};

interface BrowserResultProps {
  searchQuery?: SearchQuery;
}

interface Results {
  searchQuery?: SearchQuery;
  assets: AssetResult[];
  page: number;
  hasMore: boolean;
}

export const BrowserResults: React.FC<BrowserResultProps> = ({ searchQuery }) => {
  const loadPerPage = 8; // Assets loaded per page
  const previewWidth = 350;
  const previewHeight = 250;
  const t = useTranslation('ui.browser_results');

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [results, setResults] = React.useState<Results>({
    searchQuery,
    assets: [],
    hasMore: true,
    page: 0,
  });

  React.useEffect(() => {
    setResults({
      searchQuery: searchQuery,
      assets: [],
      hasMore: true,
      page: 0,
    });
  }, [searchQuery]);

  const fetchPage = async (
    page: number,
    searchQuery?: SearchQuery
  ): Promise<FetchResult | undefined> => {
    try {
      return await fetchAssets(searchQuery, page, loadPerPage);
    } catch (err) {
      if (err instanceof ApiError) {
        console.error('Failed to fetch assets', err);
      } else {
        throw err;
      }
    }
  };

  const loadMore = async () => {
    if (!results.hasMore) return;
    setIsLoading(true);

    const result = await fetchPage(results.page, results.searchQuery);

    if (result == undefined) {
      return;
    }
    const { assets, info } = result;

    const hasMore = results.page < info.pageCount - 1;
    const updatedResults: Results = {
      searchQuery: results.searchQuery,
      assets: [...results.assets, ...assets],
      page: info.page + (hasMore ? 1 : 0),
      hasMore: hasMore,
    };
    setResults(updatedResults);
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
      {results.assets.length == 0 && !isLoading && (
        <Label className="w-full text-center py-10 opacity-50">{t('no_assets')}</Label>
      )}
      <section
        className="grid justify-center justify-items-center gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

      >
        {results.assets.map((result) => {
          return (
            <React.Suspense key={result.id} fallback={<Preloader />}>
              <ModelPreview
                name={result.name}
                tags={result.tags}
                id={result.id}
                width={previewWidth}
                height={previewHeight}
              />
            </React.Suspense>
          );
        })}
      </section>
    </InfiniteScroll>
  );
};
