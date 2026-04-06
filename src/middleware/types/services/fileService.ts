import { BaseResponse } from '../axiosService';
import { FileGroup, FileMetaModel, SupportedFileExtensionsModel } from '../models/file';

// Select Supported File Extensions

export interface FileSupportedFileExtensionsResponse extends BaseResponse {
  supportedFileExtensions: SupportedFileExtensionsModel;
}

// Check If File Is Supported

export interface CheckIfFileIsSupportedQuery {
  fileName: string;
  fileSizeBytes: number;
}

export interface CheckIfFileIsSupportedData {
  fileName: string;
  fileSizeBytes: number;
}

export interface CheckIfFileIsSupportedResponse extends BaseResponse {
  isSupported: boolean;
  group: FileGroup;
}

// Select File Meta

export interface FileMetaQuery {
  id: number;
}


export interface FileMetaResponse extends BaseResponse {
  meta: FileMetaModel;
}

// Select Preview

export interface FilePreviewQuery {
  id: number;
}

// Select

export interface FileQuery {
  id: number;
}
