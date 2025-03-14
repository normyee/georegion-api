import axios, { AxiosInstance } from "axios";
import { INetwork, RequestConfig } from "./types";

export class NetworkAxiosAdapter implements INetwork {
  private api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
    });

    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        return Promise.reject(error.response?.data || error.message);
      }
    );
  }

  get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.api.get(url, config);
  }

  delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.api.delete(url, config);
  }

  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.api.post(url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.api.put(url, data, config);
  }

  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.api.patch(url, data, config);
  }
}