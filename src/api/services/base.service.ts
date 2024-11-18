import axios from 'axios';
import { APP_CONFIG } from '../../config/app.config';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${APP_CONFIG.API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { token } = response.data;
        localStorage.setItem('token', token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (error) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Base service class with common functionality
export class BaseService {
  protected async get<T>(endpoint: string, useMock: boolean = APP_CONFIG.USE_MOCK_DATA): Promise<T> {
    if (useMock) {
      // Return mock data if available and mock mode is enabled
      const mockData = await this.getMockData();
      return mockData as T;
    }

    const response = await apiClient.get<T>(endpoint);
    return response.data;
  }

  protected async post<T>(endpoint: string, data: any): Promise<T> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      // Simulate successful response with mock data
      return this.getMockData() as T;
    }

    const response = await apiClient.post<T>(endpoint, data);
    return response.data;
  }

  protected async put<T>(endpoint: string, data: any): Promise<T> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      // Simulate successful response with mock data
      return this.getMockData() as T;
    }

    const response = await apiClient.put<T>(endpoint, data);
    return response.data;
  }

  protected async delete(endpoint: string): Promise<void> {
    if (APP_CONFIG.USE_MOCK_DATA) {
      // Simulate successful deletion
      return Promise.resolve();
    }

    await apiClient.delete(endpoint);
  }

  protected getMockData(): any {
    // Override this method in derived services to provide mock data
    throw new Error('Mock data not implemented');
  }
}