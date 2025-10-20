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
} from '../../libs/ui/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { BrowserResults, SearchQuery } from '../../libs/ui/components/BrowserResults';
import { Category, Tag } from '../../middleware/api';
import ApiError from '../../middleware/api/ApiError';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Clear, Set } from '../../store/slices/BrowserFilter';
import { useResponsive } from '../../libs/hooks/useResponsive';
import { cn } from '../../libs/utils';
import { OffcanvasHandle, OffcanvasModal } from '../../libs/ui/components/OffcanvasModal';

const Browser: React.FC = () => {
  const categoryApi = new Category(import.meta.env.VITE_API_PATH);
  const tagApi = new Tag(import.meta.env.VITE_API_PATH);

  const [categories, setCategories] = React.useState<CategoryOption[]>([]);
  const [tags, setTags] = React.useState<TagOption[]>([]);

  const offcanvasHandleRef = React.useRef<OffcanvasHandle>(null);

  const BrowserFilter = useSelector((state: RootState) => state.BrowserFilter);
  const Dispatch = useDispatch<AppDispatch>();

  const [searchText, setSearchText] = React.useState<string>(BrowserFilter.value?.nameQuery ?? '');

  const [searchQuery, setSearchQuery] = React.useState<SearchQuery | undefined>({
    nameQuery: searchText,
    categories: categories.filter((category) => category.isSelected),
    tags: tags.filter((tag) => tag.isSelected),
  });

  const { isDesktop } = useResponsive();

  const resetFilters = () => {
    setSearchText('');

    const updatedCategories = [...categories].map((category) => ({
      ...category,
      isSelected: false,
    }));
    setCategories(updatedCategories);

    const updatedTags = [...tags].map((tag) => ({
      ...tag,
      isSelected: false,
    }));
    setTags(updatedTags);

    Dispatch(Clear());
  };

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryApi.get_all();
        return data.categories.map((category) => ({
          ...category,
          isSelected:
            BrowserFilter.value?.categories.find(
              (otherCategory) => category.id == otherCategory.id
            ) !== undefined,
        }));
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
        return data.tags.map((tag) => ({
          ...tag,
          isSelected:
            BrowserFilter.value?.tags.find((otherTag) => tag.id == otherTag.id) !== undefined,
        }));
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


  const BrowserFilters = (
    <>
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
    </>
  );

  return (
    <BaseLayout bordered={true}>
      <main className="w-100 h-100 d-flex flex-column">
        <div className={cn("w-100 py-4 bg-light row mx-0 px-2")}>
          <section className={cn("px-0 d-flex align-items-center justify-content-center", isDesktop ? "col-10" : "col-10")}>
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
          {!isDesktop && (
            <div className='col-2'>
              <Button
                variant="light"
                className='w-100 p-0 justify-content-center'
                onClick={() => offcanvasHandleRef?.current?.open()}
              >
                <FontAwesomeIcon icon={faFilter} className="fs-2" />
              </Button>
            </div>
          )}
        </div>
        <div className="row w-100 flex-grow-1 overflow-y-hidden">
          <BrowserResults searchQuery={searchQuery} />
          {isDesktop && (
            <aside className="sticky-top h-min-content col-xl-2 col-4 d-flex flex-column">
              {BrowserFilters}
            </aside>
          )}
        </div>
      </main>
      {!isDesktop && (
        <OffcanvasModal ref={offcanvasHandleRef} title='Filters' >
          {BrowserFilters}
        </OffcanvasModal>
      )}
    </BaseLayout >
  );
};

export default Browser;
