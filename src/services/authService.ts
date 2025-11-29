// src/services/authService.ts
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
}

class AuthService {
  private readonly TOKEN_KEY = 'craft_connect_token';
  private readonly USER_KEY = 'craft_connect_user';

  // Mock users for demo purposes
  private mockUsers: User[] = [
    {
      id: '1',
      username: 'john_artisan',
      email: 'john@example.com',
      role: 'artisan'
    },
    {
      id: '2',
      username: 'jane_customer',
      email: 'jane@example.com',
      role: 'customer'
    }
  ];

  async login(data: LoginData): Promise<{ token: string; user: User }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication - in real app, this would be handled by backend
    const user = this.mockUsers.find(u => u.email === data.email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Mock token
    const token = `mock_token_${user.id}_${Date.now()}`;
    
    // Store in localStorage
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    return { token, user };
  }

  async register(data: RegisterData): Promise<{ token: string; user: User }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = this.mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser: User = {
      id: `${Date.now()}`,
      username: data.username,
      email: data.email,
      role: data.role
    };

    // Add to mock users (in real app, this would be handled by backend)
    this.mockUsers.push(newUser);

    // Mock token
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    
    // Store in localStorage
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));

    return { token, user: newUser };
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
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
}

const authService = new AuthService();
export default authService;