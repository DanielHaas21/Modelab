import { BaseResponse } from '../axiosService';
import { CategoryModel } from '../models/category';

// All

export interface CategoryAllResponse extends BaseResponse {
  categories: CategoryModel[];
}

// Select

export interface CategorySelectQuery {
  id: number;
}

export interface CategorySelectResponse extends BaseResponse {
  category: CategoryModel;
}

// Create

export interface CategoryCreateQuery {
  name: string;
}

export interface CategoryCreateData {
  name: string;
}

export interface CategoryCreateResponse extends BaseResponse {
  id: number;
  message: string;
}

// Delete

export interface CategoryDeleteQuery {
  id: number;
}

export interface CategoryDeleteResponse extends BaseResponse {
  id: number;
  message: string;
}
