import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';

// adjust later
interface ApiResponse {
  success: boolean;
  data: Object;
  message?: string;
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

  // Axios request wrapper methods
  protected async GET(url: string, config?: AxiosRequestConfig): Promise<Object> {
    const response: AxiosResponse<ApiResponse> = await this.axiosInstance.get(url, config);

    return response.data;
  }

  protected async POST(url: string, data?: Object, config?: AxiosRequestConfig): Promise<Object> {
    const response: AxiosResponse<ApiResponse> = await this.axiosInstance.post(url, data, config);

    return response.data;
  }
}
