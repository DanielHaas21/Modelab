import { Clearance } from '../../../store/types';

export interface UserModel {
  email: string,
  givenName: string,
  familyName: string,
  picture: string,
  clearance: Clearance
}