import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import ApiError from './api/ApiError';

// Base API response
interface ApiResponse {
  data: object;
  message?: string;
  cause?: string;
}

/**
 * Serves as the base class with elemental protocols
 */
export class Service {
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

  private checkResponse(response: AxiosResponse<ApiResponse>): void {
    if (response.status !== 200)
      throw new ApiError('Failed with code: ' + response.status, response.status, 'request');

    if (response.data.cause !== undefined) {
      throw new ApiError(
        response.data.message ?? 'message',
        response.status,
        response.data.cause ?? 'service'
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
  protected async GET(url: string, config?: AxiosRequestConfig): Promise<object> {
    config = this.addAuthHeader(config);
    const response: AxiosResponse<ApiResponse> = await this.axiosInstance.get(url, config);
    this.checkResponse(response);
    return response.data;
  }

  protected async POST(url: string, data?: object, config?: AxiosRequestConfig): Promise<object> {
    config = this.addAuthHeader(config);
    const response: AxiosResponse<ApiResponse> = await this.axiosInstance.post(url, data, config);
    this.checkResponse(response);
    return response.data;
  }
}
