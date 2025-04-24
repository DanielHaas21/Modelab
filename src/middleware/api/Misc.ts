import Service from './Service';
import { routes } from '../routes';

export class Misc extends Service {
  constructor(baseURL: string) {
    super(baseURL);
  }

  public async Info(): Promise<Object> {
    return this.GET(routes.MISC.Info);
  }
}
