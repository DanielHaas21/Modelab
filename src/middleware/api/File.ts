import { Service } from '../Service';
import { ROUTES } from '../routes';
import { API_PATH } from '../apiPath';

export class File extends Service {
  constructor() {
    super(API_PATH);
  }

  public async get(id: number): Promise<string> {
    return this.GET(this.getURL(id)) as Promise<string>;
  }

  public getURL(id: number): string {
    return this.baseURL + ROUTES.GET.File + id;
  }
}
