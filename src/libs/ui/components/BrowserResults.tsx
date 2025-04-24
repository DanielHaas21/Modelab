import * as React from 'react';
import { CategoryOption, TagOption } from './BrowserFilters';
import { ModelPreview } from './ModelPreview';
import { Label } from './Label';
import { Preloader } from './Preloader';
import { Asset } from '../../../middleware/api';
import ApiError from '../../../middleware/api/ApiError';

export interface SearchQuery {
  category: CategoryOption;
  tags: TagOption[];
  query: string;
}

interface ModelResult {
  name: string;
  tags: string[];
}

interface BrowserResultProps {
  searchQuery?: SearchQuery;
}

const fetchAssets = async (searchQuery?: SearchQuery) => {
  const assetApi = new Asset(import.meta.env.VITE_API_PATH);

  // Get all if no query
  // if (searchQuery === undefined) {
  const { assets, info } = await assetApi.get_all(0, 10);

  return assets.map((asset) => {
    return {
      name: asset.name,
      tags: asset.tags.map((tag) => tag.name),
    };
  });
  // }

  // Use the search
  // const { assets, info } = await assetApi.search({
  //   page: 0,
  //   count: 10,
  //   categoryQuery: undefined,
  //   tagQuery: undefined,
  //   nameQuery: undefined,
  //   descriptionQuery: undefined,
  // });

  // return assets.map((asset) => {
  //   return {
  //     name: asset.name,
  //     tags: asset.tags.map((tag) => tag.name),
  //   };
  // });
};

export const BrowserResults: React.FC<BrowserResultProps> = ({ searchQuery }) => {
  const [loadedResults, setLoadedResults] = React.useState<ModelResult[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        setLoadedResults(await fetchAssets(searchQuery));
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('Failed to fetch assets', err);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [searchQuery]);

  if (loading) {
    return <Preloader />;
  }

  if (loadedResults.length === 0) {
    return <Label className="text-center w-100">No results</Label>;
  }
  return (
    <>
      {...loadedResults.map((result) => {
        return (
          <React.Suspense fallback={<Preloader />}>
            <ModelPreview name={result.name} tags={result.tags} />
          </React.Suspense>
        );
      })}
    </>
  );
};
