import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retried?: boolean;
  }
}
