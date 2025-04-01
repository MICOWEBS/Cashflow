export interface ApiError {
  message: string;
  error?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
} 