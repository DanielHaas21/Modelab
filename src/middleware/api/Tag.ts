import { routes } from '../routes';
import Service from './Service';

export interface TagData {
  name: string;
  id: number;
}

export interface TagCreate {
  id: number;
}

export interface TagGet {
  tag: TagData;
}

export interface TagGetAll {
  tags: TagData[];
}

export interface TagDelete {
  id: number;
}

export class Tag extends Service {
  constructor(baseURL: string) {
    super(baseURL);
  }

  public async create(): Promise<TagCreate> {
    return this.POST(routes.POST.Tag + 'create') as Promise<TagCreate>;
  }

  public async get(id: number): Promise<TagGet> {
    return this.POST(routes.POST.Tag + id) as Promise<TagGet>;
  }

  public async get_all(): Promise<TagGetAll> {
    return this.POST(routes.POST.Tag + 'all') as Promise<TagGetAll>;
  }

  public async delete(id: number): Promise<TagDelete> {
    return this.POST(routes.POST.Tag + id + '/delete') as Promise<TagDelete>;
  }
}
