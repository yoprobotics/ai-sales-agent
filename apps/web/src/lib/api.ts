export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.message || `HTTP ${response.status}`,
      error
    );
  }

  return response.json();
}

export const api = {
  get: <T = any>(url: string, options?: RequestInit) =>
    apiRequest<T>(url, { ...options, method: 'GET' }),
    
  post: <T = any>(url: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),
    
  put: <T = any>(url: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),
    
  patch: <T = any>(url: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
    
  delete: <T = any>(url: string, options?: RequestInit) =>
    apiRequest<T>(url, { ...options, method: 'DELETE' }),
};