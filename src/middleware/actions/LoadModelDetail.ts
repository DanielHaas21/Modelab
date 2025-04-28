import { ModelFileProps } from '../../libs/types/ModelFileProps';
import { binaryStringToFile } from '../../libs/utils';
import { Asset, File} from '../api';

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
  Files: ModelFileProps[];
}

export default async function LoadModelDetail(id: number): Promise<ModelData> {
  const FILE = new File(import.meta.env.VITE_API_PATH);
  const ASSET = new Asset(import.meta.env.VITE_API_PATH);

  const ModelMetadata = await ASSET.get(id);
  const FileMetadata = await ASSET.get_files(id);
  const BinFile = await FILE.get(id);

  const name = ModelMetadata.asset.name;
  const desc = ModelMetadata.asset.description;
  const category = ModelMetadata.asset.category;
  const tags = ModelMetadata.asset.tags;

  const mainFile = FileMetadata.files.filter((file) => file.isMain != true);

  console.log(mainFile);
  const data: ModelData = {
    id: id,
    name: name,
    desc: desc,
    category: category,
    tags: tags,
    Files:[]
  };
  return data;
}
