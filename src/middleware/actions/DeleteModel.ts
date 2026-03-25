import { ASSET } from "../ApiServices";
import { DeleteModelData } from "../types";

export default async function deleteModel(data: DeleteModelData): Promise<number> {
  const id = await ASSET.delete(data.id);
  return id.id;
}