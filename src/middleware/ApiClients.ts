import { Asset, Category, File, Tag } from './api/';

export const ASSET = new Asset(import.meta.env.VITE_API_PATH);
export const TAG = new Tag(import.meta.env.VITE_API_PATH);
export const FILE = new File(import.meta.env.VITE_API_PATH);
export const CATEGORY = new Category(import.meta.env.VITE_API_PATH);
