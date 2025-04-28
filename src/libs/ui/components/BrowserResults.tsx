import * as React from 'react';
import { CategoryOption, TagOption } from './BrowserFilters';
import { ModelPreview } from './ModelPreview';
import { Label } from './Label';
import { Preloader } from './Preloader';
import { Asset, AssetData, PaginatedInfo } from '../../../middleware/api';
import ApiError from '../../../middleware/api/ApiError';
import { InfiniteScroll } from './InfiniteScroll';

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
  const assetApi = new Asset(import.meta.env.VITE_API_PATH);

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
    const { assets, info } = await assetApi.get_all(page, count);
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

export const BrowserResults: React.FC<BrowserResultProps> = ({ searchQuery }) => {
  const loadPerPage = 2; // Assets loaded per page

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  interface Results {
    searchQuery?: SearchQuery;
    assets: AssetResult[];
    page: number;
    hasMore: boolean;
  }

  const [results, setResults] = React.useState<Results>({
    assets: [],
    hasMore: true,
    page: 0,
  });

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setResults({
        searchQuery: searchQuery,
        assets: [],
        hasMore: true,
        page: 0,
      });
    }, 200);

    return () => clearTimeout(handler);
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
      className="col-xl-10 col-8 h-100"
      hasMore={results.hasMore}
      itemCount={results.assets.length}
      loadMore={loadMore}
      loader={<Label className="w-100 text-center">Loading...</Label>}
    >
      {results.assets.length == 0 && !isLoading && (
        <Label className="w-100 text-center">Found nothing.</Label>
      )}
      <section className="d-flex flex-wrap previews mx-0">
        {...results.assets.map((result) => {
          return (
            <React.Suspense fallback={<Preloader />}>
              <ModelPreview name={result.name} tags={result.tags} id={result.id} />
            </React.Suspense>
          );
        })}
      </section>
    </InfiniteScroll>
  );
};
