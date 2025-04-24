import { routes } from '../routes';
import Service from './Service';

export class Tag extends Service {
  constructor(baseURL: string) {
    super(baseURL);
  }

  public async create(): Promise<Object> {
    return this.POST(routes.POST.Tag + 'create');
  }

  public async get(id: number): Promise<Object> {
    return this.POST(routes.POST.Tag + id);
  }

  public async get_all(): Promise<Object> {
    return this.POST(routes.POST.Tag + 'all');
  }
  
  public async delete(id: number): Promise<Object> {
    return this.POST(routes.POST.Tag + id + '/delete');
  }
}
