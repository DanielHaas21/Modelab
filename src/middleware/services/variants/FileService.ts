import { CheckIfFileIsSupportedData, CheckIfFileIsSupportedQuery, CheckIfFileIsSupportedResponse, FileMetaQuery, FileMetaResponse, FilePreviewQuery, FileQuery, FileSupportedFileExtensionsResponse } from '../../types/services/fileService';
import { getServiceBaseURL } from '../../utils/getBaseURL';
import { AxiosService } from '../AxiosService';

export class FileService extends AxiosService {
  constructor() {
    super(getServiceBaseURL('file'));
  }

  public async getSupportedFileExtensions() {
    return await this.POST<FileSupportedFileExtensionsResponse>(`supportedExtensions`);
  }

  public async checkIfFileIsSupported(query: CheckIfFileIsSupportedQuery) {
    const data: CheckIfFileIsSupportedData = {
      fileName: query.fileName,
      fileSizeBytes: query.fileSizeBytes,
    };
    return await this.POST<CheckIfFileIsSupportedResponse>(`isSupported`, data);
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