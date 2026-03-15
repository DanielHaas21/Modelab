import { API_PATH } from '../apiPath';
import { ROUTES } from '../routes';
import { Service } from '../Service';

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
  constructor() {
    super(API_PATH);
  }

  public async create(name: string): Promise<CategoryCreate> {
    return this.POST(ROUTES.POST.Category + 'create', { name: name }) as Promise<CategoryCreate>;
  }

  public async get(id: number): Promise<CategoryGet> {
    return this.POST(ROUTES.POST.Category + id) as Promise<CategoryGet>;
  }

  public async getAll(): Promise<CategoryGetAll> {
    return this.POST(ROUTES.POST.Category + 'all') as Promise<CategoryGetAll>;
  }

  public async delete(id: number): Promise<CategoryDelete> {
    return this.POST(ROUTES.POST.Category + id + '/delete') as Promise<CategoryDelete>;
  }
}
