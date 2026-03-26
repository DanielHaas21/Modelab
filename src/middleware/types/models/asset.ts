import { CategoryModel } from './category'
import { TagModel } from './tag'

export interface AssetModel {
  id: number;
  name: string;
  description: string;
  author: string;
  category: CategoryModel;
  tags: TagModel[];
  created: Date;
  updated: Date;
}

export interface AssetRaw extends Omit<AssetModel, 'created' | 'updated'> {
  created: string;
  updated: string;
}

export interface AssetQueries {
  nameQuery?: string;
  descriptionQuery?: string;
  authorQuery?: string;
  categoryQuery?: CategoryModel[];
  tagQuery?: TagModel[];
}