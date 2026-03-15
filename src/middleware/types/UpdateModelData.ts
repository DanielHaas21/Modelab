import { LocalManageFile } from './ManageModel';

export interface UpdateModelData {
  id: number;
  name: string;
  desc: string;
  category: number;
  tags: number[];
  files: LocalManageFile[];
}