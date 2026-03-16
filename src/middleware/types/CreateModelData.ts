import { LocalManageFile } from './ManageModel';

export interface CreateModelData {
  name: string;
  description: string;
  author: string | null;
  category: number;
  tags: number[];
  files: LocalManageFile[];
}