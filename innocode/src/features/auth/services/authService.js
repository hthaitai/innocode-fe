import { authApi } from '@/api/authApi';
import { decodeJWT, isTokenExpired } from '@/shared/utils/jwtUtils';

// Helper function to clear all auth data from localStorage
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user'); // Remove old user data if exists
};

export const authService = {
  // Login
  async login(credentials) {
    try {
      const response = await authApi.login(credentials);
      const apiData = response.data.data;
      if (apiData.token) {
        localStorage.setItem('token', apiData.token);
      }

      // Store refreshToken if available
      if (apiData.refreshToken) {
        localStorage.setItem("refreshToken", apiData.refreshToken);
      }

      // Decode user info from JWT token instead of storing in localStorage
      const user = decodeJWT(apiData.token);
      
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
      console.log('📤 Register request data:', userData);
      const response = await authApi.register(userData);
      console.log('📥 Register response:', response);

      const apiData = response.data.data;

      // Same structure as login
      if (apiData.token) {
        localStorage.setItem('token', apiData.token);
      }

      // Store refreshToken if available
      if (apiData.refreshToken) {
        localStorage.setItem("refreshToken", apiData.refreshToken);
      }

      // Decode user info from JWT token instead of storing in localStorage
      const user = decodeJWT(apiData.token);

      return {
        token: apiData.token,
        user: user,
      };
    } catch (error) {
      console.error('❌ Register error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error message:', error.response?.data?.message);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      // Try to call API logout
      await authApi.logout();
    } catch (error) {
      console.error('❌ Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      // Always clear all auth data from local storage
      clearAuthData();
    }
  },

  // Helper: Check if authenticated (token exists and not expired)
  // Returns true if token is valid, false otherwise
  // Note: This doesn't automatically refresh token, use refreshToken() for that
  isAuthenticated() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    // Check if token is expired
    if (isTokenExpired(token)) {
      return false;
    }
    return true;
  },

  // Helper: Get user by decoding JWT token
  getUser() {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    return decodeJWT(token);
  },

  // Helper: Get token
  getToken() {
    const token = localStorage.getItem('token');
    return token === 'null' ? null : token;
  },

  // Helper: Get refresh token
  getRefreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return refreshToken === 'null' ? null : refreshToken;
  },

  // Refresh access token using refresh token
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authApi.refresh(refreshToken);
      const apiData = response.data.data;

      if (apiData.token) {
        localStorage.setItem('token', apiData.token);
      }

      // Update refreshToken if new one is provided
      if (apiData.refreshToken) {
        localStorage.setItem('refreshToken', apiData.refreshToken);
      }

      // Decode user info from new JWT token
      const user = decodeJWT(apiData.token);

      return {
        token: apiData.token,
        user: user,
      };
    } catch (error) {
      console.error('❌ Refresh token error:', error);
      // If refresh fails, clear all tokens and logout
      this.logoutLocal();
      throw error;
    }
  },

  // Helper: Get user role
  getUserRole() {
    const user = this.getUser();
    return user?.role || null;
  },

  // Logout without API (fallback)
  logoutLocal() {
    clearAuthData();
    window.location.href = '/login';
  },
};
