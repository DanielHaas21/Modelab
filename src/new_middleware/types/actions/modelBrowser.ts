import { AssetModel, AssetQueries, PaginationInfo, PaginationQuery } from '../models';
import { Category } from './category';
import { Tag } from './tag';

export interface ModelBrowserContext {
  config: BrowserConfig;
  search: BrowserSearchAction;
}

// Config

export interface BrowserConfig {
  allCategories: Category[];
  allTags: Tag[];
}

// Search

export interface BrowserSearchParams {
  pagination: PaginationQuery;
  queries: AssetQueries;
}

export interface BrowserSearchResponse {
  assets: AssetModel[];
  pagination: PaginationInfo;
}

export type BrowserSearchAction = (params: BrowserSearchParams) => Promise<BrowserSearchResponse>;