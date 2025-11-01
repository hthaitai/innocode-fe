import { authApi } from '@/api/authApi';

export const authService = {
  // Login
  async login(credentials) {
    try {
      const response = await authApi.login(credentials);
      const apiData = response.data.data;
      if (apiData.token) {
        localStorage.setItem('token', apiData.token);
      }

      // Backend không có refreshToken, skip
      // if (apiData.refreshToken) {
      //   localStorage.setItem("refreshToken", apiData.refreshToken);
      // }

      // Tạo user object từ các field riêng lẻ
      const user = {
        id: apiData.userId,
        email: apiData.email,
        name: apiData.fullName,
        role: apiData.role.toLowerCase(), // "Student" -> "student"
      };

      localStorage.setItem('user', JSON.stringify(user));
      // Return format giống cũ để AuthContext hoạt động
      return {
        token: apiData.token,
        user: user,
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  },

  // Register
  async register(userData) {
    try {
      const response = await authApi.register(userData);

      const apiData = response.data.data;

      // Same structure as login
      if (apiData.token) {
        localStorage.setItem('token', apiData.token);
      }

      const user = {
        id: apiData.userId,
        email: apiData.email,
        name: apiData.fullName,
        role: apiData.role.toLowerCase(),
      };

      localStorage.setItem('user', JSON.stringify(user));

      return {
        token: apiData.token,
        user: user,
      };
    } catch (error) {
      console.error('❌ Register error:', error);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  },

  // Helper: Check if authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!(token && token !== 'null');
  },

  // Helper: Get user from localStorage
  getUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'null') {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error('❌ Parse user error:', error);
      return null;
    }
  },

  // Helper: Get token
  getToken() {
    const token = localStorage.getItem('token');
    return token === 'null' ? null : token;
  },

  // Helper: Get user role
  getUserRole() {
    const user = this.getUser();
    return user?.role || null;
  },

  // Logout without API (fallback)
  logoutLocal() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};
