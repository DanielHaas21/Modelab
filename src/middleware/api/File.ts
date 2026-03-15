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

export interface GetSupportedFileTypes {
  supportedFileTypes: SupportedFileTypes;
}

export class FileService extends Service {
  private objLoader = new OBJLoader();
  private fbxLoader = new FBXLoader();

  constructor() {
    super(API_PATH);
  }

  private async getBlobFromUrl(url: string, fileType: string): Promise<Blob> {
    const data = await this.GET(url, { responseType: 'arraybuffer' }) as ArrayBuffer;
    const blob = new Blob([data], { type: fileType });
    return blob;
  }

  public async loadModelFromLocalFile(file: File, fileType: string) {
    if (!this.isModelFileLoadable(fileType)) {
      return null;
    }

    switch (fileType) {
      case 'model/obj':
        const textData = await file.text();
        return this.objLoader.parse(textData);

      case 'model/fbx':
      case 'application/octet-stream':
        const bufferData = await file.arrayBuffer();
        return this.fbxLoader.parse(bufferData, file.name);

      default:
        return null;
    }
  }

  public async loadModelFromUrl(url: string, fileType: string) {
    if (!this.isModelFileLoadable(fileType)) {
      return null;
    }

    switch (fileType) {
      case 'model/obj':
        const textData = await this.GET(url, { responseType: 'text', timeout: 0 }) as unknown as string;
        return this.objLoader.parse(textData);

      case 'model/fbx':
      case 'application/octet-stream':
        const bufferData = await this.GET(url, { responseType: 'arraybuffer', timeout: 0 }) as unknown as ArrayBuffer;
        return this.fbxLoader.parse(bufferData, url);

      default:
        return null;
    }
  }

  public isModelFileLoadable(fileType: string) {
    return LOADABLE_MODEL_FILES.includes(fileType as LoadableModelType);
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

  public async getBlob(id: number, fileType: string): Promise<Blob> {
    const url = this.getAssetURL(id);
    return await this.getBlobFromUrl(url, fileType);
  }

  public async getPreviewBlob(id: number, fileType: string): Promise<Blob> {
    const url = this.getPreviewURL(id);
    return await this.getBlobFromUrl(url, fileType);
  }

  public async getSupportedFileTypes(): Promise<GetSupportedFileTypes> {
    return await this.GET(this.baseURL + ROUTES.GET.File + 'supported') as GetSupportedFileTypes;
  }
}