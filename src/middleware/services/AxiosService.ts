import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import { ApiResponseError } from './ApiResponseError';
import { isErrorResponse } from '../utils/isErrorResponse';

/**
 * Serves as the base class with elemental protocols
 */
export class AxiosService {
  private axiosInstance: AxiosInstance;
  protected baseURL: string;
  protected bearerToken: string | null;

  constructor(baseURL: string, bearerToken?: string) {
    this.bearerToken = bearerToken ?? null;
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public setToken(bearerToken: string | null) {
    this.bearerToken = bearerToken;
  }

  public getToken() {
    return this.bearerToken;
  }

  private checkResponse(response: AxiosResponse<unknown>): void {
    if (response.status !== 200)
      throw new ApiResponseError('Failed with code: ' + response.status, response.status, 'request');

    if (response.data instanceof ArrayBuffer || response.data instanceof Blob) {
      return;
    }

    if (isErrorResponse(response.data)) {
      const errorResponse = response.data;
      throw new ApiResponseError(
        errorResponse.message,
        errorResponse.code,
        errorResponse.cause
      );
    }
  }

  private addAuthHeader(config?: AxiosRequestConfig) {
    if (config === undefined) {
      config = {};
    }

    if (this.bearerToken !== undefined) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.bearerToken}`,
      };
    }

    return config;
  }

  // Axios request wrapper methods
  protected async GET<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    config = this.addAuthHeader(config);
    const response: AxiosResponse<unknown> = await this.axiosInstance.get(url, config);
    this.checkResponse(response);
    return response.data as T;
  }

  protected async POST<T>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    config = this.addAuthHeader(config);
    const response: AxiosResponse<unknown> = await this.axiosInstance.post(url, data, config);
    this.checkResponse(response);
    return response.data as T;
  }
}
