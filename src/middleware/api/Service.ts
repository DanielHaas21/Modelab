import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import ApiError from './ApiError';

// adjust later
interface ApiResponse {
  data: Object;
  message?: string;
  cause?: string;
}

/**
 * Serves as the base class with elemental protocols
 */
export default class Service {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private checkResponse(response: AxiosResponse<ApiResponse>): void {
    if (response.status !== 200)
      throw new ApiError('Failed with code: ' + response.status, response.status, 'request');

    if (response.data.cause !== undefined) {
      throw new ApiError(
        response.data.message ?? 'message',
        response.status,
        response.data.cause ?? 'server'
      );
    }
  }

  // Axios request wrapper methods
  protected async GET(url: string, config?: AxiosRequestConfig): Promise<Object> {
    const response: AxiosResponse<ApiResponse> = await this.axiosInstance.get(url, config);
    this.checkResponse(response);
    return response.data;
  }

  protected async POST(url: string, data?: Object, config?: AxiosRequestConfig): Promise<Object> {
    const response: AxiosResponse<ApiResponse> = await this.axiosInstance.post(url, data, config);
    this.checkResponse(response);
    return response.data;
  }
}
