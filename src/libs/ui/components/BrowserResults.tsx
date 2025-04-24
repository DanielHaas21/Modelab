import * as React from 'react';
import { CategoryOption, TagOption } from './BrowserFilters';
import { ModelPreview } from './ModelPreview';
import { Label } from './Label';
import { Preloader } from './Preloader';

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
  searchQuery: SearchQuery;
}

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const testResults: ModelResult[] = [
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
  { name: 'test', tags: ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'] },
];

const testFetch = async () => {
  await sleep(500);
  return testResults;
};

export const BrowserResults: React.FC<BrowserResultProps> = ({ searchQuery }) => {
  const [loadedResults, setLoadedResults] = React.useState<ModelResult[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const results = await testFetch();
      setLoadedResults(results);
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
            <ModelPreview name={result.name} tags={result.tags} id={1}/>
          </React.Suspense>
        );
      })}
    </>
  );
};
