import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import {
  Input,
  TagSelect,
  Label,
  CategorySelect,
  CategoryOption,
  TagOption,
  Button,
  GeneralPopup,
} from '../../libs/ui/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { BrowserResults, SearchQuery } from '../../libs/ui/components/BrowserResults';
import { Category, Tag } from '../../middleware/api';
import ApiError from '../../middleware/api/ApiError';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Clear, Set } from '../../store/slices/BrowserFilter';

const Browser: React.FC = () => {
  const categoryApi = new Category(import.meta.env.VITE_API_PATH);
  const tagApi = new Tag(import.meta.env.VITE_API_PATH);

  const [categories, setCategories] = React.useState<CategoryOption[]>([]);
  const [tags, setTags] = React.useState<TagOption[]>([]);

  const BrowserFilter = useSelector((state: RootState) => state.BrowserFilter);
  const Dispatch = useDispatch<AppDispatch>();

  const [searchText, setSearchText] = React.useState<string>(BrowserFilter.value?.nameQuery ?? '');

  const [searchQuery, setSearchQuery] = React.useState<SearchQuery | undefined>({
    nameQuery: searchText,
    categories: categories.filter((category) => category.isSelected),
    tags: tags.filter((tag) => tag.isSelected),
  });

  const resetFilters = () => {
    setSearchText('');

    const updatedCategories = [...categories].map((category) => {
      return {
        ...category,
        isSelected: false,
      };
    });
    setCategories(updatedCategories);

    const updatedTags = [...tags].map((tag) => {
      return {
        ...tag,
        isSelected: false,
      };
    });
    setTags(updatedTags);

    Dispatch(Clear());
  };

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryApi.get_all();
        return data.categories.map((category) => {
          return {
            ...category,
            isSelected:
              BrowserFilter.value?.categories.find(
                (otherCategory) => category.id == otherCategory.id
              ) !== undefined,
          };
        });
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('Failed to fetch categories', err);
        } else {
          throw err;
        }
      }
    };

    const loadTags = async () => {
      try {
        const data = await tagApi.get_all();
        return data.tags.map((tag) => {
          return {
            ...tag,
            isSelected:
              BrowserFilter.value?.tags.find((otherTag) => tag.id == otherTag.id) !== undefined,
          };
        });
      } catch (err) {
        if (err instanceof ApiError) {
          console.error('Failed to fetch tags', err);
        } else {
          throw err;
        }
      }
    };

    const load = async () => {
      const categories = (await loadCategories()) ?? [];
      const tags = (await loadTags()) ?? [];
      setCategories(categories);
      setTags(tags);
      if (BrowserFilter.value !== null) {
        setSearchText(BrowserFilter.value.nameQuery);
      }
    };

    load();
  }, []);

  React.useEffect(() => {
    const newSearchQuery = {
      nameQuery: searchText,
      categories: categories.filter((category) => category.isSelected),
      tags: tags.filter((tag) => tag.isSelected),
    };

    if (newSearchQuery.nameQuery.length == 0 && categories.length == 0 && tags.length == 0) {
      Dispatch(Clear());
    } else {
      setSearchQuery(newSearchQuery);
      Dispatch(Set(newSearchQuery));
    }
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
          <aside className="sticky-top h-min-content col-xl-2 col-4 d-flex flex-column">
            <div className="w-100">
              <Label size="xs">Category</Label>
              <div className="w-100">
                <CategorySelect
                  categories={categories}
                  setCategories={setCategories}
                  isRadio={false}
                />
              </div>
            </div>

            <div className="w-100 mt-4">
              <Label size="xs">Tags</Label>
              <div className="w-100">
                <TagSelect tags={tags} setTags={setTags} />
              </div>
            </div>

            <div className="w-100 mt-4">
              <Button
                onClick={resetFilters}
                className="w-100 justify-content-center"
                size={'sm'}
                variant="light"
              >
                Clear Filters
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </BaseLayout>
  );
};

export default Browser;
