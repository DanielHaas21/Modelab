import { Service } from '../Service';
import { ROUTES } from '../routes';
import { API_PATH } from '../apiPath';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { SupportedFileTypes } from '../../libs/utils/isFile';

export const LOADABLE_MODEL_FILES = [
  'model/obj',
  'model/fbx',
  'application/octet-stream',
] as const;

export type LoadableModelType = typeof LOADABLE_MODEL_FILES[number];

export class File extends Service {
  private objLoader = new OBJLoader();
  private fbxLoader = new FBXLoader();

  constructor() {
    super(API_PATH);
  }

  private async fetchWithAuth(url: string): Promise<Response> {
    const response = await fetch(url, {
      headers: this.bearerToken ? { Authorization: `Bearer ${this.bearerToken}` } : {},
    });

    if (!response.ok) {
      throw new Error(`File service error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  public async loadModelFromUrl(url: string, fileType: string) {
    if (!LOADABLE_MODEL_FILES.includes(fileType as LoadableModelType)) {
      console.log('not loadable', fileType);
      return null;
    }

    const response = await this.fetchWithAuth(url);

    switch (fileType) {
      case 'model/obj':
        const text = await response.text();
        return this.objLoader.parse(text);

      case 'model/fbx':
      case 'application/octet-stream':
        const buffer = await response.arrayBuffer();
        return this.fbxLoader.parse(buffer, url);

      default:
        return null;
    }
  }

  public async loadModelFromFile(id: number, fileType: string) {
    return await this.loadModelFromUrl(this.getAssetURL(id), fileType);
  }

  public getAssetURL(id: number): string {
    return this.baseURL + ROUTES.GET.File + id;
  }

  public getPreviewURL(id: number): string {
    return this.getAssetURL(id) + '/preview';
  }

  public async getBlob(id: number): Promise<Blob> {
    const response = await this.fetchWithAuth(this.getAssetURL(id));
    return await response.blob();
  }

  public async getPreviewBlob(id: number): Promise<Blob> {
    const response = await this.fetchWithAuth(this.getPreviewURL(id));
    return await response.blob();
  }

  public async getSupportedFileTypes(): Promise<SupportedFileTypes> {
    return await this.GET(this.baseURL + ROUTES.GET.File + 'supported') as SupportedFileTypes;
  }

}