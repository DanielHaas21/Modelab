import { BaseResponse } from '../axiosService';
import { UserModel } from '../models/user';

// Login

export interface UserLoginQuery {
  accessToken: string;
}

export interface UserLoginData {
  accessToken: string;
}

export interface UserLoginResponse extends BaseResponse {
  token: string;
}

// Info

export interface UserInfoResponse extends BaseResponse {
  user: UserModel;
}
