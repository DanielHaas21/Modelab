import Service from './Service';
import { routes } from '../routes';

export class File extends Service {
  constructor(baseURL: string) {
    super(baseURL);
  }

  public async get(id: number): Promise<string> {
    return this.GET(this.getURL(id)) as Promise<string>;
  }

  public getURL(id: number): string {
    return this.baseURL + routes.GET.File + id;
  }
}
