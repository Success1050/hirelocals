import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, clearAuthData } from '@/lib/tokenStorage';
import { userLogout, getCurrentUser } from '@/app/auth/authactions/action';

// Define User type
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CUSTOMER' | 'PROVIDER' | 'BOTH' | 'ADMIN';
    phoneNumber?: string;
    profileImage?: string;
    address?: string;
    city?: string;
    state?: string;
}

// Define Auth Context type
interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isProviderProfileComplete: boolean;
    login: (userData: User, authToken: string) => void;
    logout: () => Promise<void>;
    updateUser: (userData: User) => void;
    refreshUser: () => Promise<void>;
    checkProviderStatus: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProviderProfileComplete, setIsProviderProfileComplete] = useState(false);

    // Check for existing auth on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            const storedToken = await getToken();
            const storedUser = await getUser();

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);

                // Check provider profile if applicable
                if (storedUser.role === 'PROVIDER' || storedUser.role === 'BOTH') {
                    await checkProviderStatus();
                }
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkProviderStatus = async () => {
        try {
            // Import dynamically to avoid circular dependency if any, or just use imported providerAPI
            // Since providerAPI is in lib/api, it's fine.
            // We need to import providerAPI at the top of the file
            const { providerAPI } = require('@/lib/api');
            const response = await providerAPI.getProfile();
            if (response && response.success && response.profile) {
                setIsProviderProfileComplete(true);
            } else {
                setIsProviderProfileComplete(false);
            }
        } catch (error) {
            // If 404, it means no profile
            console.log('Provider profile not found');
            setIsProviderProfileComplete(false);
        }
    };

    const login = async (userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);
        if (userData.role === 'PROVIDER' || userData.role === 'BOTH') {
            await checkProviderStatus();
        }
    };

    const logout = async () => {
        try {
            await userLogout();
            setUser(null);
            setToken(null);
            setIsProviderProfileComplete(false);
        } catch (error) {
            console.error('Error during logout:', error);
            // Clear local state even if API call fails
            setUser(null);
            setToken(null);
            setIsProviderProfileComplete(false);
        }
    };

    const updateUser = (userData: User) => {
        setUser(userData);
    };

    const refreshUser = async () => {
        try {
            const response = await getCurrentUser();
            if (response.success && response.user) {
                setUser(response.user);
                if (response.user.role === 'PROVIDER' || response.user.role === 'BOTH') {
                    await checkProviderStatus();
                }
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        isProviderProfileComplete,
        login,
        logout,
        updateUser,
        refreshUser,
        checkProviderStatus,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
