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
    login: (userData: User, authToken: string) => void;
    logout: () => Promise<void>;
    updateUser: (userData: User) => void;
    refreshUser: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = (userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);
    };

    const logout = async () => {
        try {
            await userLogout();
            setUser(null);
            setToken(null);
        } catch (error) {
            console.error('Error during logout:', error);
            // Clear local state even if API call fails
            setUser(null);
            setToken(null);
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
        login,
        logout,
        updateUser,
        refreshUser,
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
