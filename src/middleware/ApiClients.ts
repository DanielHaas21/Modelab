import { AssetService, Category, FileService, TagService } from './api/';
import { UserService } from './auth/User';

export const ASSET = new AssetService();
export const TAG = new TagService();
export const FILE = new FileService();
export const CATEGORY = new Category();
export const USER = new UserService();
