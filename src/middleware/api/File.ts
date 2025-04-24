import Service from './Service';
import { routes } from '../routes';

export class File extends Service {
  constructor(baseURL: string) {
    super(baseURL);
  }

  public async get(id: number): Promise<string> {
    return this.GET(routes.GET.File + id) as Promise<string>;
  }
}
