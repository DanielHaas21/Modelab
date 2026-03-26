import { BaseResponse } from '../axiosService';
import { FileMetaModel, SupportedFileTypesModel } from '../models/file';

// Select Supported File Types

export interface FileSupportedFileTypesResponse extends BaseResponse {
  supportedFileTypes: SupportedFileTypesModel;
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
