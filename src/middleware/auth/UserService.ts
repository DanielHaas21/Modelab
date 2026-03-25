import { Clearance } from '../../store/types';
import { Service } from '../Service';
import { API_PATH } from '../apiPath';
import { ROUTES } from '../routes';

export interface UserLogin {
  token: string;
}

export interface UserData {
  email: string;
  givenName: string;
  familyName: string;
  picture: string;
  clearance: Clearance;
}

export interface GetUserInfo {
  user: UserData;
}

export class UserService extends Service {
  constructor() {
    super(API_PATH);
  }

  public async login(accessToken: string): Promise<UserLogin> {
    return this.POST(ROUTES.User + 'login', { accessToken }) as Promise<UserLogin>;
  }

  public async getInfo(): Promise<GetUserInfo> {
    return this.POST(ROUTES.User + 'info') as Promise<GetUserInfo>;
  }
}
