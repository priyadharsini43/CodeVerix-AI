const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}/api${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Sends HTTP-only auth cookies automatically
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = responseData?.message || responseData?.error || 'An unexpected error occurred';
    throw new ApiError(message, response.status);
  }

  // NestJS TransformInterceptor wraps output in { success: true, data: ... }
  if (responseData && typeof responseData === 'object' && 'data' in responseData) {
    return responseData.data as T;
  }

  return responseData as T;
}
