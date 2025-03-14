import { Request } from "express";
import { Logger as PinoLogger } from "pino";

export interface TenantRequest extends Request {
  tenant?: { id: string };
}

export interface GeoResponse {
  features: Array<{
    properties: {
      display_name?: string;
      name?: string;
    };
    geometry: {
      coordinates: [number, number];
    };
  }>;
}

export type GeoAddress = string;

export type GeoCoordinates =
  | {
      lng: number;
      lat: number;
    }
  | [number, number];

export type LoggerInstance = PinoLogger;

export interface ILogger {
  logger: LoggerInstance;
  createLogger(): PinoLogger;
  getLogger(): PinoLogger;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  data?: unknown;
}

export interface INetwork {
  get<T>(url: string, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<T>;
}

export interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface IAuthProvider {
  tokenize(userId: string): string;
  validate(token: string): DecodedToken | null;
}

export type MongoConnectionConfig = {
  host: string;
  port: string;
  name: string;
};
