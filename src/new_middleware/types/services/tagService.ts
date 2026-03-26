import { BaseResponse } from '../axiosService';
import { TagModel } from '../models/tag';

// All

export interface TagAllResponse extends BaseResponse {
  tags: TagModel;
}

// Select

export interface TagSelectQuery {
  id: number;
}

export interface TagSelectResponse extends BaseResponse {
  tag: TagModel;
}

// Create

export interface TagCreateQuery {
  name: string;
}

export interface TagCreateData {
  name: string;
}

export interface TagCreateResponse extends BaseResponse {
  id: number;
  message: string;
}

// Delete

export interface TagDeleteQuery {
  id: number;
}

export interface TagDeleteResponse extends BaseResponse {
  id: number;
  message: string;
}
