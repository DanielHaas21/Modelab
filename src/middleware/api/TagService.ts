import { API_PATH } from '../apiPath';
import { ROUTES } from '../routes';
import { Service } from '../Service';

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

export class TagService extends Service {
  constructor() {
    super(API_PATH);
  }

  public async create(): Promise<TagCreate> {
    return this.POST(ROUTES.Tag + 'create') as Promise<TagCreate>;
  }

  public async get(id: number): Promise<TagGet> {
    return this.POST(ROUTES.Tag + id) as Promise<TagGet>;
  }

  public async getAll(): Promise<TagGetAll> {
    return this.POST(ROUTES.Tag + 'all') as Promise<TagGetAll>;
  }

  public async delete(id: number): Promise<TagDelete> {
    return this.POST(ROUTES.Tag + id + '/delete') as Promise<TagDelete>;
  }
}
