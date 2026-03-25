import { Service } from '../Service';
import { ROUTES } from '../routes';
import { API_PATH } from '../apiPath';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { SupportedFileTypes } from '../../libs/utils/isFile';

export const LOADABLE_MODEL_EXTENSIONS = [
  '.obj',
  '.fbx',
] as const;

export type LoadableModelExtension = typeof LOADABLE_MODEL_EXTENSIONS[number];

export interface GetSupportedFileTypes {
  supportedFileTypes: SupportedFileTypes;
}

export class FileService extends Service {
  private objLoader = new OBJLoader();
  private fbxLoader = new FBXLoader();

  constructor() {
    super(API_PATH);
  }

  private getExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf('.');
    return lastDot !== -1 ? fileName.slice(lastDot).toLowerCase() : '';
  }

  private getMimeFromExtension(extension: string): string {
    switch (extension) {
      case '.obj': return 'model/obj';
      case '.fbx': return 'model/fbx';
      default: return 'application/octet-stream';
    }
  }

  private async getBlobFromUrl(url: string, fileName: string): Promise<Blob> {
    const extension = this.getExtension(fileName);
    const data = await this.GET(url, { responseType: 'arraybuffer' }) as ArrayBuffer;
    return new Blob([data], { type: this.getMimeFromExtension(extension) });
  }

  public async loadModelFromLocalFile(file: File) {
    const extension = this.getExtension(file.name);

    if (!this.isModelFileLoadable(file.name)) {
      return null;
    }

    switch (extension) {
      case '.obj': {
        const textData = await file.text();
        return this.objLoader.parse(textData);
      }
      case '.fbx': {
        const bufferData = await file.arrayBuffer();
        return this.fbxLoader.parse(bufferData, file.name);
      }
      default:
        return null;
    }
  }

  public async loadModelFromUrl(url: string, fileName: string) {
    const extension = this.getExtension(fileName);

    if (!this.isModelFileLoadable(fileName)) {
      return null;
    }

    switch (extension) {
      case '.obj': {
        const textData = await this.GET(url, { responseType: 'text', timeout: 0 }) as unknown as string;
        return this.objLoader.parse(textData);
      }
      case '.fbx': {
        const bufferData = await this.GET(url, { responseType: 'arraybuffer', timeout: 0 }) as unknown as ArrayBuffer;
        return this.fbxLoader.parse(bufferData, url);
      }
      default:
        return null;
    }
  }

  public isModelFileLoadable(fileName: string) {
    const extension = this.getExtension(fileName);
    return LOADABLE_MODEL_EXTENSIONS.includes(extension as LoadableModelExtension);
  }

  public async loadModelFromFile(id: number, fileName: string) {
    return await this.loadModelFromUrl(this.getAssetURL(id), fileName);
  }

  public getAssetURL(id: number): string {
    return this.baseURL + ROUTES.File + id;
  }

  public getPreviewURL(id: number): string {
    return this.getAssetURL(id) + '/preview';
  }

  public async getBlob(id: number, fileName: string): Promise<Blob> {
    const url = this.getAssetURL(id);
    return await this.getBlobFromUrl(url, fileName);
  }

  public async getPreviewBlob(id: number, fileName: string): Promise<Blob> {
    const url = this.getPreviewURL(id);
    return await this.getBlobFromUrl(url, fileName);
  }

  public async getSupportedFileTypes(): Promise<GetSupportedFileTypes> {
    return await this.POST(this.baseURL + ROUTES.File + 'supported') as GetSupportedFileTypes;
  }
}