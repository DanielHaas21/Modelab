import { Asset, Category, FileService, Tag } from './api/';
import { User } from './auth/User';

export const ASSET = new Asset();
export const TAG = new Tag();
export const FILE = new FileService();
export const CATEGORY = new Category();
export const USER = new User();
