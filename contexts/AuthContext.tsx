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
    const usedCachedSession = React.useRef(false);

    // Check for existing auth on mount
    useEffect(() => {
        checkAuth();
    }, []);

    // Background retry: if we used a cached session, silently validate once the server wakes up
    useEffect(() => {
        if (!isLoading && usedCachedSession.current && token) {
            const retryTimer = setTimeout(async () => {
                try {
                    console.log('[AUTH DEBUG] Background retry: validating token with backend...');
                    const { authAPI } = require('@/lib/api');
                    const response = await authAPI.getMe();
                    if (response?.success && response.user) {
                        console.log('[AUTH DEBUG] Background retry succeeded, refreshing user data');
                        setUser(response.user);
                        if (response.user.role === 'PROVIDER' || response.user.role === 'BOTH') {
                            await checkProviderStatus();
                        }
                    }
                } catch (err: any) {
                    const status = err?.response?.status;
                    if (status === 401 || status === 403) {
                        console.log('[AUTH DEBUG] Background retry: token rejected, clearing auth');
                        await clearAuthData();
                        setToken(null);
                        setUser(null);
                        setIsProviderProfileComplete(false);
                    }
                    // If still a network error, leave cached session intact
                } finally {
                    usedCachedSession.current = false;
                }
            }, 10000); // Retry after 10s to give Render time to wake up

            return () => clearTimeout(retryTimer);
        }
    }, [isLoading, token]);

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            const storedToken = await getToken();
            const storedUser = await getUser();

            console.log('[AUTH DEBUG] Stored token exists:', !!storedToken);
            console.log('[AUTH DEBUG] Stored user:', storedUser);

            if (storedToken && storedUser) {
                // Try to validate the token with the backend
                try {
                    const { authAPI } = require('@/lib/api');
                    const response = await authAPI.getMe();
                    console.log('[AUTH DEBUG] getMe response:', JSON.stringify(response));
                    if (response && response.success && response.user) {
                        // Token is valid, use fresh user data from backend
                        console.log('[AUTH DEBUG] Token valid. User role:', response.user.role);
                        setToken(storedToken);
                        setUser(response.user);

                        // Check provider profile if applicable
                        if (response.user.role === 'PROVIDER' || response.user.role === 'BOTH') {
                            console.log('[AUTH DEBUG] User is PROVIDER/BOTH, checking provider status...');
                            await checkProviderStatus();
                        }
                    } else {
                        // Backend explicitly said no user — token is invalid, clear stale data
                        console.log('[AUTH DEBUG] Token invalid or no user, clearing auth data');
                        await clearAuthData();
                        setToken(null);
                        setUser(null);
                    }
                } catch (validationError: any) {
                    // Distinguish between network errors and actual auth failures
                    const status = validationError?.response?.status;
                    const isNetworkError = !validationError?.response; // No response = network issue

                    if (isNetworkError) {
                        // Network error (server cold start, no internet, timeout, etc.)
                        // Trust the cached user data — don't log the user out
                        console.log('[AUTH DEBUG] Network error during validation — using cached session');
                        usedCachedSession.current = true;
                        setToken(storedToken);

                        // Parse stored user if it's a string
                        const parsedUser = typeof storedUser === 'string' ? JSON.parse(storedUser) : storedUser;
                        setUser(parsedUser);

                        // Check provider profile from cached data (don't call backend)
                        if (parsedUser.role === 'PROVIDER' || parsedUser.role === 'BOTH') {
                            console.log('[AUTH DEBUG] Cached user is PROVIDER/BOTH, setting provider profile as complete (cached)');
                            setIsProviderProfileComplete(true);
                        }
                    } else if (status === 401 || status === 403) {
                        // Token is definitively invalid/expired — clear auth
                        console.log('[AUTH DEBUG] Token rejected by server (status', status, '), clearing auth data');
                        await clearAuthData();
                        setToken(null);
                        setUser(null);
                    } else {
                        // Other server error (500, etc.) — trust cached data
                        console.log('[AUTH DEBUG] Server error (status', status, ') — using cached session');
                        usedCachedSession.current = true;
                        setToken(storedToken);
                        const parsedUser = typeof storedUser === 'string' ? JSON.parse(storedUser) : storedUser;
                        setUser(parsedUser);

                        if (parsedUser.role === 'PROVIDER' || parsedUser.role === 'BOTH') {
                            setIsProviderProfileComplete(true);
                        }
                    }
                }
            } else {
                console.log('[AUTH DEBUG] No stored token or user, user is NOT authenticated');
            }
        } catch (error) {
            console.error('Error checking auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const checkProviderStatus = async () => {
        try {
            const { providerAPI } = require('@/lib/api');
            const response = await providerAPI.getProfile();
            console.log('[AUTH DEBUG] checkProviderStatus response:', JSON.stringify(response));
            if (response && response.success && (response.profile || response.provider)) {
                console.log('[AUTH DEBUG] Provider profile EXISTS -> isProviderProfileComplete = true');
                setIsProviderProfileComplete(true);
            } else {
                console.log('[AUTH DEBUG] Provider profile response but no profile data -> isProviderProfileComplete = false');
                setIsProviderProfileComplete(false);
            }
        } catch (error) {
            console.log('[AUTH DEBUG] Provider profile fetch FAILED (likely 404) -> isProviderProfileComplete = false', error);
            setIsProviderProfileComplete(false);
        }
    };

    const login = async (userData: User, authToken: string) => {
        // Set loading to true so the layout shows a spinner 
        // instead of briefly flashing the wrong screen
        setIsLoading(true);
        try {
            setUser(userData);
            setToken(authToken);
            if (userData.role === 'PROVIDER' || userData.role === 'BOTH') {
                await checkProviderStatus();
            }
        } finally {
            setIsLoading(false);
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
