import { LocalManageFile } from './ManageModel';

export interface CreateModelData {
  name: string;
  desc: string;
  category: number;
  tags: number[];
  files: LocalManageFile[];
}