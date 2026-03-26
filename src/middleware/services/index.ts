import { AdminService } from './variants/AdminService';
import { AssetService } from './variants/AssetService';
import { CategoryService } from './variants/CategoryService';
import { FileService } from './variants/FileService';
import { ServerService } from './variants/ServerService';
import { TagService } from './variants/TagService';
import { UserService } from './variants/UserService';

export const ADMIN = new AdminService();
export const ASSET = new AssetService();
export const CATEGORY = new CategoryService();
export const FILE = new FileService();
export const SERVER = new ServerService();
export const TAG = new TagService();
export const USER = new UserService();

export const SERVICES = [
  ADMIN,
  ASSET,
  CATEGORY,
  FILE,
  SERVER,
  TAG,
  USER,
] as const;
