import { ASSET } from "../ApiClients";
import { UpdateModelData } from "../types";

export default async function editModel(data: UpdateModelData): Promise<number> {
    const id = await ASSET.update(data);
    return id.id;
}