import axios, { AxiosInstance, AxiosError } from 'axios';
import { getToken } from './tokenStorage';

// Backend base URL
const BASE_URL = 'https://sillconnect-backend.onrender.com/';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints

export const authAPI = {
  /**
   * Register a new user
   */
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role?: 'CUSTOMER' | 'PROVIDER';
    address?: string;
    city?: string;
    state?: string;
  }) => {
    const response = await apiClient.post('api/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('api/auth/login', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getMe: async () => {
    const response = await apiClient.get('api/auth/me');
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await apiClient.post('api/auth/logout');
    return response.data;
  },

  /**
   * Switch user role
   */
  switchRole: async (newRole: 'CUSTOMER' | 'PROVIDER' | 'BOTH') => {
    const response = await apiClient.put('api/auth/switch-role', { newRole });
    return response.data;
  },
};

export const providerAPI = {
    createProfile: async (data: any) => {
        // Use FormData if sending files, otherwise JSON might work depending on backend
        // But backend uses multer, so FormData is safest if files are involved.
        // For now, if no files, we can try JSON, but usually mixed content requires FormData.
        // Let's assume we might need to change this to FormData in the component if images are added.
        const response = await apiClient.post('/api/providers', data);
        return response.data;
    },
    getProfile: async () => {
        const response = await apiClient.get('/api/providers/me');
        return response.data;
    },
    updateProfile: async (data: any) => {
        const response = await apiClient.put('/api/providers', data);
        return response.data;
    },
    createService: async (data: any) => {
        const response = await apiClient.post('/api/providers/services', data);
        return response.data;
    },
    getCategories: async () => {
        const response = await apiClient.get('/api/providers/categories');
        return response.data;
    },
    // Portfolio Management
    getPortfolio: async () => {
        const response = await apiClient.get('/api/providers/portfolio');
        return response.data;
    },
    addPortfolioItem: async (formData: FormData) => {
        const response = await apiClient.post('/api/providers/portfolio', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    deletePortfolioItem: async (id: string) => {
        const response = await apiClient.delete(`/api/providers/portfolio/${id}`);
        return response.data;
    },
};

// Export the configured axios instance for other API calls
export default apiClient;
