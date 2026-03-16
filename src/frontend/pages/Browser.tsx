import * as React from 'react';
import { BaseLayout } from '../../libs/ui/layouts';
import {
  Input,
  TagSelect,
  Label,
  CategorySelect,
  CategoryOption,
  Button,
  TagOption,
} from '../../libs/ui/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { BrowserResults, SearchQuery } from '../../libs/ui/components/BrowserResults';
import { Category, TagService } from '../../middleware/api';
import ApiError from '../../middleware/api/ApiError';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Clear, Set } from '../../store/slices/BrowserFilter';
import { useResponsive } from '../../libs/hooks/useResponsive';
import { cn } from '../../libs/utils';
import { OffcanvasHandle, OffcanvasModal } from '../../libs/ui/components/OffcanvasModal';
import { useTranslation } from '../../libs/ui/provider';

const Browser: React.FC = () => {
  const categoryApi = new Category();
  const tagApi = new TagService();

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
  const t = useTranslation("pages.browser");

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
        const data = await categoryApi.getAll();
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
        const data = await tagApi.getAll();
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
      <div className="w-full">
        <Label size="xs">{t("categories")}</Label>
        <div className="w-full">
          <CategorySelect
            categories={categories}
            setCategories={setCategories}
            isRadio={false}
          />
        </div>
      </div>

      <div className="mt-4">
        <Label size="xs">{t("tags")}</Label>
        <div className="">
          <TagSelect tags={tags} setTags={setTags} />
        </div>
      </div>

      <div className="mt-4">
        <Button
          onClick={resetFilters}
          className="w-full justify-center"
          size={'sm'}
          variant="light"
        >
          {t("clear_filters")}
        </Button>
      </div>
    </>
  );

  return (
    <BaseLayout bordered={true}>
      <main className="w-full h-full flex flex-col bg-bg-100">
        <div className={cn("w-full py-4 flex mx-0 px-2")}>
          <section className={cn("px-0 flex items-center justify-center", isDesktop ? "w-10/12" : "w-10/12")}>
            <Input
              size="xl"
              placeholder="Search"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
              }}
              inputGroupBefore={
                <span className="flex items-center px-3 text-text-500 border-r border-ui-border">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl" />
                </span>
              }
            />
          </section>
          {!isDesktop && (
            <div className='w-2/12 pl-2'>
              <Button
                variant="light"
                className='w-full p-0 justify-center'
                onClick={() => offcanvasHandleRef?.current?.open()}
              >
                <FontAwesomeIcon icon={faFilter} className="text-xl" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex w-full grow overflow-hidden">
          <BrowserResults searchQuery={searchQuery} />
          {isDesktop && (
            <aside className="sticky top-0 h-full w-1/4 xl:w-1/6 flex flex-col p-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
              {BrowserFilters}
            </aside>
          )}
        </div>
      </main>
      {!isDesktop && (
        <OffcanvasModal ref={offcanvasHandleRef} title='Filters' >
          <div className="p-4">
            {BrowserFilters}
          </div>
        </OffcanvasModal>
      )}
    </BaseLayout >
  );
};

export default Browser;
