// Mock API client - simulates HTTP requests using mock data
// In production, replace with real axios or fetch-based client

class MockAPIClient {
  private delay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async get<T>(_endpoint: string): Promise<T> {
    await this.delay();
    return Promise.resolve({} as T);
  }

  async post<T>(_endpoint: string, data: T): Promise<T> {
    await this.delay();
    return Promise.resolve(data);
  }

  async patch<T>(_endpoint: string, data: T): Promise<T> {
    await this.delay();
    return Promise.resolve(data);
  }

  async delete<T>(_endpoint: string): Promise<T> {
    await this.delay();
    return Promise.resolve({} as T);
  }

  async put<T>(_endpoint: string, data: T): Promise<T> {
    await this.delay();
    return Promise.resolve(data);
  }
}

export const apiClient = new MockAPIClient();
