// Mock API client - simulates HTTP requests using mock data
// In production, replace with real axios or fetch-based client

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000');

class MockAPIClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string): Promise<T> {
    await this.delay();
    // Mock implementation - in production, make real HTTP request
    return Promise.resolve({} as T);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    await this.delay();
    // Mock implementation
    return Promise.resolve(data as T);
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    await this.delay();
    return Promise.resolve(data as T);
  }

  async delete<T>(endpoint: string): Promise<T> {
    await this.delay();
    return Promise.resolve({} as T);
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    await this.delay();
    return Promise.resolve(data as T);
  }
}

export const apiClient = new MockAPIClient();
