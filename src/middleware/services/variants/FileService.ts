import { FileMetaQuery, FileMetaResponse, FilePreviewQuery, FileQuery, FileSupportedFileTypesResponse } from '../../types/services/fileService';
import { getServiceBaseURL } from '../../utils/getBaseURL';
import { AxiosService } from '../AxiosService';

export class FileService extends AxiosService {
  constructor() {
    super(getServiceBaseURL('file'));
  }

  public async getSupportedFileTypes() {
    return await this.POST<FileSupportedFileTypesResponse>(`supported`);
  }

  public async getMeta(query: FileMetaQuery) {
    return await this.POST<FileMetaResponse>(`${query.id}/meta`);
  }

  public getPreviewUrl(query: FilePreviewQuery): string {
    return `${this.baseURL}${query.id}/preview`;
  }

  public async get(query: FileQuery): Promise<Blob> {
    const data = await this.GET<ArrayBuffer>(`${query.id}`, {
      responseType: 'arraybuffer'
    });
    return new Blob([data], { type: 'application/octet-stream' });
  }

  public async getBuffer(query: FileQuery): Promise<ArrayBuffer> {
    return await this.GET<ArrayBuffer>(`${query.id}`, {
      responseType: 'arraybuffer'
    });
  }

}