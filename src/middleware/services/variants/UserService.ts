import { UserInfoResponse, UserLoginData, UserLoginQuery, UserLoginResponse } from '../../types/services/userService';
import { getServiceBaseURL } from '../../utils/getBaseURL';
import { AxiosService } from '../AxiosService';

export class UserService extends AxiosService {
  constructor() {
    super(getServiceBaseURL('user'));
  }

  public async login(query: UserLoginQuery) {
    const data: UserLoginData = {
      accessToken: query.accessToken
    };
    return await this.POST<UserLoginResponse>(`create`, data);
  }

  public async info() {
    return await this.POST<UserInfoResponse>(`info`);
  }

}