import { type APIResponse } from "@/types/api";
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

export const useApiStore = create<ApiState>((set, get) => ({
  call: async (
    url: string,
    method: "GET" | "POST" | "DELETE" | "PATCH" | "PUT" = "GET",
    data: object | null = null,
    headers: object | null = null,
  ) => {
    const token = import.meta.env.VITE_TOKEN;

    if (!token)
      console.error(
        "VITE_ERROR wasn't set by the server. Without it API won't work",
      );

    const config: AxiosRequestConfig = {
      url,
      baseURL: "http://localhost:8000",
      method,
      headers: {
        "Content-Type": "application/json",
        "X-APP-TOKEN": token,
      },
    };

    if (data) config.data = data;
    if (headers) config.headers = headers;

    return await axios.request<APIResponse>(config);
  },
}));
