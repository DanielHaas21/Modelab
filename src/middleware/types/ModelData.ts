import { ModelFileProps } from '../../libs/types/ModelFileProps';

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
  files: {
    mainFile: ModelFileProps;
    other: ModelFileProps[];
  };
}
