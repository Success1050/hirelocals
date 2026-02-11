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
  /**
   * Update user profile (generic)
   */
  updateProfile: async (formData: FormData) => {
    const response = await apiClient.put('api/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const providerAPI = {
    createProfile: async (formData: FormData) => {
        const response = await apiClient.post('api/providers', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    getProfile: async () => {
        const response = await apiClient.get('api/providers/me');
        return response.data;
    },
    updateProfile: async (formData: FormData) => {
        const response = await apiClient.put('api/providers', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    createService: async (data: any) => {
        const response = await apiClient.post('api/providers/services', data);
        return response.data;
    },
    getServices: async () => {
        const response = await apiClient.get('api/providers/services');
        return response.data;
    },
    updateService: async (id: string, data: any) => {
        const response = await apiClient.put(`api/providers/services/${id}`, data);
        return response.data;
    },
    deleteService: async (id: string) => {
        const response = await apiClient.delete(`api/providers/services/${id}`);
        return response.data;
    },
    getCategories: async () => {
        const response = await apiClient.get('api/providers/categories');
        return response.data;
    },
    // Portfolio Management
    getPortfolio: async () => {
        const response = await apiClient.get('api/providers/portfolio');
        return response.data;
    },
    addPortfolioItem: async (formData: FormData) => {
        const response = await apiClient.post('api/providers/portfolio', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    deletePortfolioItem: async (id: string) => {
        const response = await apiClient.delete(`api/providers/portfolio/${id}`);
        return response.data;
    },
    // Service Portfolio (Images specific to a service)
    addServiceImages: async (serviceId: string, formData: FormData) => {
        const response = await apiClient.post(`api/providers/services/${serviceId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    getServiceImages: async (serviceId: string) => {
        const response = await apiClient.get(`api/providers/services/${serviceId}/images`);
        return response.data;
    },
    deleteServiceImage: async (serviceId: string, imageId: string) => {
        const response = await apiClient.delete(`api/providers/services/${serviceId}/images/${imageId}`);
        return response.data;
    },
};

export const userAPI = {
    getCategories: async () => {
        const response = await apiClient.get('api/providers/categories');
        return response.data;
    },
    getAllServices: async (params?: { categoryId?: string; search?: string }) => {
        const response = await apiClient.get('api/providers/all-services', { params });
        return response.data;
    },
    getServiceById: async (id: string) => {
        const response = await apiClient.get(`api/providers/services/${id}`);
        return response.data;
    },
    getAllProviders: async (params?: { categoryId?: string; search?: string }) => {
        const response = await apiClient.get('api/providers/all-providers', { params });
        return response.data;
    },
    getProviderById: async (id: string) => {
        const response = await apiClient.get(`api/providers/${id}`);
        return response.data;
    },
};

// Export the configured axios instance for other API calls
export default apiClient;
