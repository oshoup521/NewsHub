import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, AuthResponse, LoginCredentials, RegisterCredentials } from '../types';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('newshub_token');
      const storedUser = localStorage.getItem('newshub_user');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        // Verify token is still valid
        await refreshUser();
      }
    } catch (error) {
      // Token might be expired, clear storage
      localStorage.removeItem('newshub_token');
      localStorage.removeItem('newshub_user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response: AuthResponse = await apiService.login(credentials);
      
      localStorage.setItem('newshub_token', response.access_token);
      localStorage.setItem('newshub_user', JSON.stringify(response.user));
      
      setUser(response.user);
      toast.success('Welcome back!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response: AuthResponse = await apiService.register(credentials);
      
      localStorage.setItem('newshub_token', response.access_token);
      localStorage.setItem('newshub_user', JSON.stringify(response.user));
      
      setUser(response.user);
      toast.success('Account created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('newshub_token');
    localStorage.removeItem('newshub_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshUser = async () => {
    try {
      const userData = await apiService.getProfile();
      setUser(userData);
      localStorage.setItem('newshub_user', JSON.stringify(userData));
    } catch (error) {
      // If refresh fails, logout user
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
