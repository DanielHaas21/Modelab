import { ModelFileProps } from '../../libs/types/ModelFileProps';
import { FileOption } from '../../libs/ui/components';

interface ModelDataProp {
  id: number;
  name: string;
}

export interface ModelData {
  id: number;
  name: string;
  desc?: string;
  category: ModelDataProp;
  tags?: ModelDataProp[];
  files: ModelFileProps[]
}

export interface CreateModelData {
  name: string;
  desc: string;
  category: number;
  tags: number[];
  files: FileOption[];
}

