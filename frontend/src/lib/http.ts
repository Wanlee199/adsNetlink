const BASE_URL = 'http://localhost:8091/PTITCinema';

type RequestConfig = RequestInit & {
  params?: Record<string, string>;
};

async function http<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const url = new URL(path.startsWith('http') ? path : `${BASE_URL}${path}`);
  
  if (config.params) {
    Object.entries(config.params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  // Read directly from localStorage to avoid Jotai dependency in non-hook context
  // The key must match what atomWithStorage uses. Default is JSON.stringify wrapped.
  // However, atomWithStorage uses a specific format. 
  // For simplicity and robustness, let's try to parse it, or just use a simple localStorage item if we were managing it manually.
  // Since we use atomWithStorage('auth_token'), Jotai stores it as a JSON string.
  let accessToken: string | null = null;
  try {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
        // atomWithStorage stores values as JSON strings, so a string "token" is stored as "\"token\""
        accessToken = JSON.parse(storedToken);
    }
  } catch (e) {
    console.error("Failed to parse auth token", e);
  }
  
  const headers = new Headers(config.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url.toString(), {
    ...config,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Clear storage on 401
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Optional: Dispatch an event or redirect
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    }
    
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return {} as T;
  }
}

export const httpClient = {
  get: <T>(path: string, config?: RequestConfig) => http<T>(path, { ...config, method: 'GET' }),
  post: <T>(path: string, body: any, config?: RequestConfig) => http<T>(path, { ...config, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: any, config?: RequestConfig) => http<T>(path, { ...config, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string, config?: RequestConfig) => http<T>(path, { ...config, method: 'DELETE' }),
};
