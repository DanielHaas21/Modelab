import { BrowserSearchParams, BrowserSearchResponse, ModelBrowserContext } from '../types/actions/modelBrowser';
import { ASSET, CATEGORY, TAG } from '../services';
import { AssetModel, PaginationInfo } from '../types/models';

const search = async (params: BrowserSearchParams): Promise<BrowserSearchResponse> => {
  const assets: AssetModel[] = [];
  let paginationInfo: PaginationInfo;

  if ((params.queries.nameQuery ?? '').length === 0
    && (params.queries.descriptionQuery ?? '').length === 0
    && (params.queries.authorQuery ?? '').length === 0
    && (params.queries.tagQuery ?? []).length === 0
    && (params.queries.categoryQuery ?? []).length === 0
  ) {
    // when no filters load all
    const all = await ASSET.getAll({
      pagination: params.pagination,
    });

    assets.push(...all.assets);
    paginationInfo = all.info;
  } else {
    const searched = await ASSET.search({
      pagination: params.pagination,
      queries: params.queries
    });

    assets.push(...searched.assets);
    paginationInfo = searched.info;
  }

  return {
    pagination: paginationInfo,
    assets: assets,
  }
};

export const loadModelBrowserContext = async (): Promise<ModelBrowserContext> => {
  const categories = (await CATEGORY.getAll()).categories;
  const tags = (await TAG.getAll()).tags;

  return {
    search: search,
    config: {
      allCategories: categories,
      allTags: tags,
    }
  }
};