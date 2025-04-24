import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import { Input, Preloader } from '../../libs/ui/components';
import { BrowserFilters, CategoryOption, TagOption } from '../../libs/ui/components/BrowserFilters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { BrowserResults, SearchQuery } from '../../libs/ui/components/BrowserResults';

const Browser: React.FC = () => {
  const previewsCol = `col-xl-10 col-8`;

  const [categories, setCategories] = React.useState<CategoryOption[]>([
    { name: '3D Model', id: 1 },
    { name: '2D Texture', id: 2 },
    { name: 'Audio', id: 3 },
  ]);
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryOption>(categories[0]);

  const [tags, setTags] = React.useState<TagOption[]>([
    { name: 'Medieval', id: 1, isSelected: true },
    { name: 'C4D', id: 2, isSelected: true },
    { name: 'Maya', id: 3 },
    { name: 'Prop', id: 4 },
    { name: 'FBX', id: 5 },
    { name: 'Unity', id: 6 },
    { name: 'Unity Second Test', id: 7 },
  ]);

  const [searchText, setSearchText] = React.useState<string>('');

  const [searchQuery, setSearchQuery] = React.useState<SearchQuery>({
    query: searchText,
    category: selectedCategory,
    tags: tags.filter((tag) => tag.isSelected),
  });

  React.useEffect(() => {
    setSearchQuery({
      query: searchText,
      category: selectedCategory,
      tags: tags.filter((tag) => tag.isSelected),
    });
  }, [searchText, tags, selectedCategory]);

  return (
    <BaseLayout bordered={true}>
      <main className="w-100 h-100 d-flex flex-row justify-content-start">
        <div className="ms-8 d-flex flex-column w-100">
          <div className="row w-100 pt-5 pb-4 sticky-top bg-light">
            <section
              className={previewsCol + ' px-0 d-flex align-items-center justify-content-center'}
            >
              <Input
                size="xl"
                placeholder="Search"
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                }}
                inputGroupBefore={
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="fs-2" />
                  </span>
                }
              />
            </section>
          </div>
          <div className="row w-100 h-100 pb-2" style={{ overflowY: 'scroll' }}>
            <section className={previewsCol + ' d-flex flex-wrap previews mx-0'}>
              <BrowserResults searchQuery={searchQuery} />
            </section>
            <BrowserFilters
              className="sticky-top h-min-content"
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              tags={tags}
              setTags={setTags}
            />
          </div>
        </div>
      </main>
    </BaseLayout>
  );
};

export default Browser;
