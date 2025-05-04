import ApiError from '../api/ApiError';
import { ModelData } from '../types';
import { ASSET } from '../ApiClients';

export default async function LoadModelDetail(id: number): Promise<ModelData> {
  const ModelMetadata = await ASSET.get(id);
  const FileMetadata = await ASSET.get_files(id);

  if (!FileMetadata) throw new ApiError('Failed to load file metadata', 404, 'service');

  const name = ModelMetadata.asset.name;
  const desc = ModelMetadata.asset.description;
  const category = ModelMetadata.asset.category;
  const tags = ModelMetadata.asset.tags;

  const data: ModelData = {
    id: id,
    name: name,
    desc: desc,
    category: category,
    tags: tags,
    files: FileMetadata.files.map((meta) => ({
      bin: import.meta.env.VITE_API_PATH + `file/${meta.id}`,
      name: meta.name,
      type: meta.type,
    })),
  };

  return data;
}
