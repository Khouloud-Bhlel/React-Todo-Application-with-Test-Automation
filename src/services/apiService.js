import secureLocalStorage from 'react-secure-storage';

const API_BASE_URL = 'http://localhost:3001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token is available
    try {
      const userData = secureLocalStorage.getItem('todoApp_user');
      if (userData && userData.tokens && userData.tokens.access) {
        config.headers.Authorization = `Bearer ${userData.tokens.access.token}`;
      }
    } catch (error) {
      console.error('Error retrieving stored user data:', error);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle no content response
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Todo methods
  async getTodos() {
    return this.request('/todos');
  }

  async createTodo(text) {
    return this.request('/todos', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async updateTodo(id, data) {
    return this.request(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTodo(id) {
    return this.request(`/todos/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleTodo(id) {
    return this.request(`/todos/${id}/toggle`, {
      method: 'PATCH',
    });
  }
}

const apiService = new ApiService();
export default apiService;
