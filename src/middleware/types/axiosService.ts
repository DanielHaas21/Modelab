
export interface BaseResponse {
  code: number;
}

export interface ErrorResponse extends BaseResponse {
  message: string;
  cause: string;
}