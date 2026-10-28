export interface ErrorDetail {
  code: number;
  message: string;
  details: object;
}

export interface APIResponse {
  success: boolean;
  data: object | null;
  error: ErrorDetail | null;
}
