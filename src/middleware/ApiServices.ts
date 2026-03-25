import { AdminService, AssetService, Category, FileService, TagService } from './api';
import { UserService } from './auth';

export const ASSET = new AssetService();
export const TAG = new TagService();
export const FILE = new FileService();
export const CATEGORY = new Category();
export const USER = new UserService();
export const ADMIN = new AdminService();

export const ALL_SERVICES = [
  ASSET,
  TAG,
  FILE,
  CATEGORY,
  USER,
  ADMIN,
] as const;
