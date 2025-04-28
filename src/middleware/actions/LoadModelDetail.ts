import { ModelFileProps } from '../../libs/types/ModelFileProps';
import { Asset } from '../api';
import { ModelData } from '../types';

export default async function LoadModelDetail(id: number): Promise<ModelData> {
  const ASSET = new Asset(import.meta.env.VITE_API_PATH);

  const ModelMetadata = await ASSET.get(id);
  const FileMetadata = await ASSET.get_files(id);
  const mainFileMeta = FileMetadata.files.find((file) => file.isMain === true);

  if (!mainFileMeta) throw "Failed to load files meta data";

  const name = ModelMetadata.asset.name;
  const desc = ModelMetadata.asset.description;
  const category = ModelMetadata.asset.category;
  const tags = ModelMetadata.asset.tags;

  const mainFile: ModelFileProps = {
    bin: import.meta.env.VITE_API_PATH + `file/${mainFileMeta.id}`,
    name: mainFileMeta.name,
    type: mainFileMeta.type,
  };

  const data: ModelData = {
    id: id,
    name: name,
    desc: desc,
    category: category,
    tags: tags,
    files: {
      mainFile: mainFile,
      other: [],
    },
  };

  return data;
}
