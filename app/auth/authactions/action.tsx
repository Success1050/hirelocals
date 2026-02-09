import { authAPI } from '@/lib/api';
import { saveToken, saveUser, clearAuthData } from '@/lib/tokenStorage';

/**
 * User registration with backend API
 */
export const userSignup = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phoneNumber?: string,
  role?: 'CUSTOMER' | 'PROVIDER'
) => {
  try {
    const response = await authAPI.register({
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      role,
    });

    if (response.success && response.token) {
      // Save token and user data to secure storage
      await saveToken(response.token);
      await saveUser(response.user);

      return {
        success: true,
        user: response.user,
        message: response.message || 'Registration successful',
      };
    }

    return {
      success: false,
      message: response.message || 'Registration failed',
    };
  } catch (error: any) {
    console.error('Signup Error:', error);

    // Extract error message from response
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'An error occurred during registration';

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * User login with backend API
 */
export const userLogin = async (email: string, password: string) => {
  try {
    const response = await authAPI.login({ email, password });

    if (response.success && response.token) {
      // Save token and user data to secure storage
      await saveToken(response.token);
      await saveUser(response.user);

      return {
        success: true,
        user: response.user,
        message: response.message || 'Login successful',
      };
    }

    return {
      success: false,
      message: response.message || 'Login failed',
    };
  } catch (error: any) {
    console.error('Login Error:', error);

    // Extract error message from response
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'An error occurred during login';

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * User logout
 */
export const userLogout = async () => {
  try {
    // Call backend logout endpoint (optional, for token blacklisting in future)
    await authAPI.logout();

    // Clear local auth data
    await clearAuthData();

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error: any) {
    console.error('Logout Error:', error);

    // Even if backend call fails, clear local data
    await clearAuthData();

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await authAPI.getMe();

    if (response.success && response.user) {
      // Update stored user data
      await saveUser(response.user);

      return {
        success: true,
        user: response.user,
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to get user profile',
    };
  } catch (error: any) {
    console.error('Get User Error:', error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to get user profile';

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Switch user role
 */
export const switchUserRole = async (newRole: 'CUSTOMER' | 'PROVIDER' | 'BOTH') => {
  try {
    const response = await authAPI.switchRole(newRole);

    if (response.success && response.user) {
      // Update stored user data
      await saveUser(response.user);

      return {
        success: true,
        user: response.user,
        message: response.message || 'Role switched successfully',
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to switch role',
    };
  } catch (error: any) {
    console.error('Switch Role Error:', error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'Failed to switch role';

    return {
      success: false,
      message: errorMessage,
    };
  }
};
