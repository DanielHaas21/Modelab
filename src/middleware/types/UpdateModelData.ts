import { LocalManageFile } from './ManageModel';

export interface UpdateModelData {
  id: number;
  name: string;
  description: string;
  author: string | null;
  category: number;
  tags: number[];
  files: LocalManageFile[];
}