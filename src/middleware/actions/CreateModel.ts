import { ASSET } from '../ApiServices';
import { CreateModelData } from '../types';

export default async function createModel(data: CreateModelData): Promise<number> {
  const id = await ASSET.create(data);
  return id.id;
}
