const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');

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

  const defaultHeaders: Record<string, string> = {};

  if (options.body) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include',
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      let message = responseData?.message || responseData?.error || 'An unexpected error occurred';
      if (Array.isArray(message)) {
        message = message.join(', ');
      } else if (typeof message === 'object' && message !== null) {
        message = JSON.stringify(message);
      }
      throw new ApiError(message, response.status);
    }

    if (responseData && typeof responseData === 'object' && 'data' in responseData) {
      return responseData.data as T;
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const rawMessage = error instanceof Error ? error.message : String(error);
    const isNetworkError =
      (error instanceof Error && error.name === 'TypeError') ||
      rawMessage.includes('Failed to fetch') ||
      rawMessage.includes('NetworkError');

    const message = isNetworkError
      ? 'Unable to connect to the backend server. Please verify backend service status and CORS configuration.'
      : rawMessage || 'Request failed';

    throw new ApiError(message, 0);
  }
}
