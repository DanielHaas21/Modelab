import { Category } from './category';
import { Tag } from './tag';

export interface AssetBase {
  id: number;
  name: string;
  author: string | null;
  description: string;
  category: Category;
  tags: Tag[];
  updated: Date;
  created: Date;
}
