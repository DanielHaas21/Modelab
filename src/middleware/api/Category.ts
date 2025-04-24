import { routes } from '../routes';
import Service from './Service';

export interface CategoryData {
  name: string;
  id: number;
}

export interface CategoryCreate {
  id: number;
}

export interface CategoryDelete {
  id: number;
}

export interface CategoryGetAll {
  categories: CategoryData[];
}

export interface CategoryGet {
  category: CategoryData;
}

export class Category extends Service {
  constructor(baseURL: string) {
    super(baseURL);
  }

  public async create(name: string): Promise<CategoryCreate> {
    return this.POST(routes.POST.Category + 'create', { name: name }) as Promise<CategoryCreate>;
  }

  public async get(id: number): Promise<CategoryGet> {
    return this.POST(routes.POST.Category + id) as Promise<CategoryGet>;
  }

  public async get_all(): Promise<CategoryGetAll> {
    return this.POST(routes.POST.Category + 'all') as Promise<CategoryGetAll>;
  }

  public async delete(id: number): Promise<CategoryDelete> {
    return this.POST(routes.POST.Category + id + '/delete') as Promise<CategoryDelete>;
  }
}
