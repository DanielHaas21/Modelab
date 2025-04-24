import { routes } from '../routes';
import Service from './Service';

export class Category extends Service {
  constructor(baseURL: string) {
    super(baseURL);
  }

  public async create(): Promise<Object> {
    return this.POST(routes.POST.Category + 'create');
  }

  public async get(id: number): Promise<Object> {
    return this.POST(routes.POST.Category + id);
  }

  public async get_all(): Promise<Object> {
    return this.POST(routes.POST.Category + 'all');
  }
  
  public async delete(id: number): Promise<Object> {
    return this.POST(routes.POST.Category + id + '/delete');
  }
}
