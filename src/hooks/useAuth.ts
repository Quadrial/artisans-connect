// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import authService from '../services/authService';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'customer' | 'artisan';
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: 'customer' | 'artisan') => Promise<void>;
  logout: () => void;
}

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const { user: loggedInUser } = await authService.login({ email, password });
      setUser(loggedInUser);
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, role: 'customer' | 'artisan'): Promise<void> => {
    try {
      const { user: registeredUser } = await authService.register({ username, email, password, role });
      setUser(registeredUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout
  };
};

export default useAuth;