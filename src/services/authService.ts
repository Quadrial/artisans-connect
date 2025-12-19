// src/services/authService.ts
import { API_ENDPOINTS } from '../config/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: 'customer' | 'artisan';
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'customer' | 'artisan';
  profilePicture?: string;
  isVerified?: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

class AuthService {
  private readonly TOKEN_KEY = 'craft_connect_token';
  private readonly USER_KEY = 'craft_connect_user';

  async login(data: LoginData): Promise<{ token: string; user: User }> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Login failed');
      }

      if (!result.token || !result.user) {
        throw new Error('Invalid response from server');
      }

      // Store in localStorage
      localStorage.setItem(this.TOKEN_KEY, result.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(result.user));

      return { token: result.token, user: result.user };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async register(data: RegisterData): Promise<{ token: string; user: User }> {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed');
      }

      if (!result.token || !result.user) {
        throw new Error('Invalid response from server');
      }

      // Store in localStorage
      localStorage.setItem(this.TOKEN_KEY, result.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(result.user));

      return { token: result.token, user: result.user };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(API_ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  async verifyToken(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch(API_ENDPOINTS.AUTH.ME, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is invalid, clear storage
        this.logout();
        return null;
      }

      const result = await response.json();
      if (result.success && result.user) {
        // Update stored user data
        localStorage.setItem(this.USER_KEY, JSON.stringify(result.user));
        return result.user;
      }

      return null;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  updateUserData(updates: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    }
  }
}

const authService = new AuthService();
export default authService;