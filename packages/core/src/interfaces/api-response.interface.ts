export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ServiceHealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  service: string;
  timestamp: Date;
  details?: Record<string, any>;
}
