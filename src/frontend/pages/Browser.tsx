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
  Preloader,
} from '../../libs/ui/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { BrowserResults } from '../../libs/ui/components/BrowserResults';
import { AppDispatch, RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Clear, Set } from '../../store/slices/BrowserFilter';
import { cn } from '../../libs/utils';
import { OffcanvasHandle, OffcanvasModal } from '../../libs/ui/components/OffcanvasModal';
import { useResponsive, useTitle, useTranslation } from '../../libs/hooks';
import { ModelBrowserContext } from '../../middleware/types/actions';
import { loadModelBrowserContext } from '../../middleware/actions/loadModelBrowserContext';
import { AssetQueries } from '../../middleware/types/models';

interface BrowserProps {
  context: ModelBrowserContext;
}

const Browser: React.FC<BrowserProps> = ({ context }) => {
  const t = useTranslation("pages.browser");

  useTitle({ type: 'name', name: 'Browser' });

  const { isDesktop } = useResponsive();

  const [categories, setCategories] = React.useState<CategoryOption[]>([]);
  const [tags, setTags] = React.useState<TagOption[]>([]);
  const [isDataSetup, setIsDataSetup] = React.useState<boolean>(false);

  const offcanvasHandleRef = React.useRef<OffcanvasHandle>(null);

  const BrowserFilter = useSelector((state: RootState) => state.BrowserFilter);
  const Dispatch = useDispatch<AppDispatch>();

  const [searchText, setSearchText] = React.useState<string>(BrowserFilter.value?.nameQuery ?? '');

  const [assetQueries, setAssetQueries] = React.useState<AssetQueries>({
    nameQuery: searchText,
    categoryQuery: categories.filter((category) => category.isSelected),
    tagQuery: tags.filter((tag) => tag.isSelected),
  });

  // setup data
  React.useEffect(() => {
    if (isDataSetup) return;
    const config = context.config;

    setCategories((config?.allCategories ?? []).map((category) => {
      return {
        ...category,
        isSelected: BrowserFilter.value?.categoryQuery?.find(
          (otherCategory) => category.id == otherCategory.id
        ) !== undefined,
      };
    }));

    setTags((config?.allTags ?? []).map((tag) => {
      return {
        ...tag,
        isSelected: BrowserFilter.value?.tagQuery?.find(
          (otherTag) => tag.id == otherTag.id
        ) !== undefined,
      };
    }));

    setIsDataSetup(true);
  }, [context, isDataSetup, BrowserFilter.value]);

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
    const newSearchQuery: AssetQueries = {
      nameQuery: searchText,
      categoryQuery: categories.filter((category) => category.isSelected),
      tagQuery: tags.filter((tag) => tag.isSelected),
    };

    if (searchText.length == 0 && categories.length == 0 && tags.length == 0) {
      Dispatch(Clear());
    } else {
      setAssetQueries(newSearchQuery);
      Dispatch(Set(newSearchQuery));
    }
  }, [searchText, tags, categories, Dispatch]);

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
          <BrowserResults
            assetQueires={assetQueries}
            search={context.search}
          />
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

const BrowserLoader: React.FC = () => {
  const [context, setContext] = React.useState<ModelBrowserContext | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const context = await loadModelBrowserContext();
        setContext(context);
      } catch (error) {
        console.error('Error fetching context:', error);
      }
    })();
  }, []);

  if (context === null) return <Preloader className="min-h-screen" />;

  return (
    <Browser
      context={context}
    />
  );
};

export default BrowserLoader;
