/**
 * StockPilot API Client
 * Wraps native fetch with timeout handling, normalized JSON parsing,
 * customizable Base URL override, and clear error responses.
 */

// Default Base URL from Vite env or fallback
const DEFAULT_API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const getApiBaseUrl = () => {
  const customUrl = localStorage.getItem('kryptix_api_base_url');
  return customUrl || DEFAULT_API_URL;
};

export const setApiBaseUrl = (newUrl) => {
  if (!newUrl) {
    localStorage.removeItem('kryptix_api_base_url');
  } else {
    localStorage.setItem('kryptix_api_base_url', newUrl.trim());
  }
};

export const resetApiBaseUrl = () => {
  localStorage.removeItem('kryptix_api_base_url');
  return DEFAULT_API_URL;
};

/**
 * Standard fetch helper with timeout
 */
async function request(endpoint, options = {}) {
  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const { timeout = 8000, headers = {}, ...customOptions } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...customOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...headers,
      },
    });

    clearTimeout(timer);

    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { text };
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP Error ${response.status}: ${response.statusText}`;
      const err = new Error(errorMessage);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    clearTimeout(timer);
    if (error.name === 'AbortError') {
      const timeoutErr = new Error(`Request timed out after ${timeout}ms. Is the backend server running?`);
      timeoutErr.isTimeout = true;
      throw timeoutErr;
    }
    throw error;
  }
}

/**
 * REST API Methods for Products
 */
export const productsApi = {
  // 1. Check Server Health
  checkHealth: async () => {
    return request('/health', { timeout: 4000 });
  },

  // 2. Fetch all products with query parameters
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await request(`/products${queryString}`);
    // Support either { success: true, data: [...] } or direct array
    return Array.isArray(res) ? res : (res.data || []);
  },

  // 3. Fetch product by ID
  getById: async (id) => {
    const res = await request(`/products/${encodeURIComponent(id)}`);
    return res.data || res;
  },

  // 4. Create new product
  create: async (productData) => {
    const res = await request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return res.data || res;
  },

  // 5. Update existing product
  update: async (id, productData) => {
    const res = await request(`/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return res.data || res;
  },

  // 6. Delete product
  delete: async (id) => {
    const res = await request(`/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.data || res;
  },
};
