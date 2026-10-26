import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { create } from "zustand";

interface ApiState {
  call: (
    url: string,
    method?: "GET" | "POST" | "DELETE" | "PATCH" | "PUT",
    data?: object | null,
    headers?: object | null,
  ) => Promise<AxiosResponse>;
}

export const useApiStore = create<ApiState>(() => ({
  call: async (
    url: string,
    method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT" = "GET",
    data: object | null = null,
    headers: object | null = null,
  ) => {
    const config: AxiosRequestConfig = {
      url,
      baseURL: "http://localhost:8000",
      method,
    };

    if (data) config.data = data;
    if (headers) config.headers = headers;

    return await axios.request(config);
  },
}));
