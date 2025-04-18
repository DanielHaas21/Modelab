import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';

// adjust later
interface ApiResponse<T> {
  success: boolean;
  data: T;
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
        // Other common headers like Authorization can be set here
      },
    });
  }

  // Axios request wrapper methods

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.get(url, config);
    return response.data.data;
  }

  public async post<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.post(url, config);
    return response.data.data;
  }
}
