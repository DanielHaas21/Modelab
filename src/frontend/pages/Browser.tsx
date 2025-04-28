import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import { Input, BrowserFilters } from '../../libs/ui/components';
import { CategoryOption, TagOption } from '../../libs/ui/components/BrowserFilters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { BrowserResults, SearchQuery } from '../../libs/ui/components/BrowserResults';
import { Category, Tag } from '../../middleware/api';
import ApiError from '../../middleware/api/ApiError';

const Browser: React.FC = () => {
  const categoryApi = new Category(import.meta.env.VITE_API_PATH);
  const tagApi = new Tag(import.meta.env.VITE_API_PATH);

  const [categories, setCategories] = React.useState<CategoryOption[]>([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.get_all();
        setCategories(data.categories);
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('Failed to fetch categories', err);
        }
      }
    };

    const fetchTags = async () => {
      try {
        const data = await tagApi.get_all();
        setTags(data.tags);
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('Failed to fetch tags', err);
        }
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const [tags, setTags] = React.useState<TagOption[]>([]);

  const [searchText, setSearchText] = React.useState<string>('');

  const [searchQuery, setSearchQuery] = React.useState<SearchQuery | undefined>({
    nameQuery: searchText,
    categories: categories.filter((category) => category.isSelected),
    tags: tags.filter((tag) => tag.isSelected),
  });

  React.useEffect(() => {
    setSearchQuery({
      nameQuery: searchText,
      categories: categories.filter((category) => category.isSelected),
      tags: tags.filter((tag) => tag.isSelected),
    });
  }, [searchText, tags, categories]);

  return (
    <BaseLayout bordered={true}>
      <main className="w-100 h-100 ps-8 d-flex flex-column">
        <div className="row w-100 pt-5 pb-4 bg-light">
          <section className="col-xl-10 col-8 px-0 d-flex align-items-center justify-content-center">
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
        <div className="row w-100 flex-grow-1 overflow-y-hidden">
          <BrowserResults searchQuery={searchQuery} />
          <BrowserFilters
            className="sticky-top h-min-content"
            categories={categories}
            setCategories={setCategories}
            tags={tags}
            setTags={setTags}
          />
        </div>
      </main>
    </BaseLayout>
  );
};

export default Browser;
