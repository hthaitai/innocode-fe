import { authApi } from '@/api/authApi';
import { decodeJWT, isTokenExpired } from '@/shared/utils/jwtUtils';

// Helper function to clear sessionStorage data for a specific user
const clearUserSessionData = (userId) => {
  if (!userId) {
    // If no userId provided, clear all timer-related data
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        if (
          key.startsWith('round_timer_') ||
          key.startsWith('openCode_') ||
          key.startsWith('mcq_test_') ||
          key.startsWith('code_') ||
          key.startsWith('testResults_')
        ) {
          sessionKeysToRemove.push(key);
        }
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
    return;
  }

  // Clear data for specific user
  const sessionKeysToRemove = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key) {
      // Check if key contains user ID or is user-specific
      if (
        key.includes(`_${userId}_`) ||
        key.startsWith(`round_timer_`) ||
        key.startsWith('openCode_') ||
        key.startsWith('mcq_test_') ||
        key.startsWith('code_') ||
        key.startsWith('testResults_')
      ) {
        sessionKeysToRemove.push(key);
      }
    }
  }
  sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
  
  // Also remove current user ID marker
  sessionStorage.removeItem('current_user_id');
  
  if (sessionKeysToRemove.length > 0 && import.meta.env.VITE_ENV === "development") {
    console.log('🧹 Cleared sessionStorage keys for user:', userId, sessionKeysToRemove);
  }
};

// Helper function to clear all auth data from localStorage
// Note: We DON'T clear sessionStorage on logout to allow user to continue after re-login
// SessionStorage will be cleared when a different user logs in
const clearAuthData = () => {
  // Clear localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Don't clear sessionStorage here - allow user to continue after re-login
  // The sessionStorage is marked with user ID and will be cleared if different user logs in
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
      
      // Check if different user is logging in - clear old user's session data
      const previousUserId = sessionStorage.getItem('current_user_id');
      if (previousUserId && previousUserId !== user.id) {
        // Different user - clear previous user's data
        clearUserSessionData(previousUserId);
        if (import.meta.env.VITE_ENV === "development") {
          console.log('🔄 Different user detected, cleared previous user data');
        }
      }
      
      // Mark current user ID in sessionStorage
      if (user?.id) {
        sessionStorage.setItem('current_user_id', user.id);
      }
      
      // Return format giống cũ để AuthContext hoạt động
      return {
        token: apiData.token,
        user: user,
      };
    } catch (error) {
      // Log error theo cấu trúc backend
      if (import.meta.env.VITE_ENV === "development") {
        const errorData = error?.response?.data || {};
        console.error('❌ Login error:', {
          status: error?.response?.status,
          code: errorData?.errorCode || errorData?.Code,
          message: errorData?.errorMessage || errorData?.Message || errorData?.message,
          url: error?.config?.url,
          data: errorData,
        });
      }
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

      // Check if different user is registering - clear old user's session data
      const previousUserId = sessionStorage.getItem('current_user_id');
      if (previousUserId && previousUserId !== user.id) {
        clearUserSessionData(previousUserId);
      }
      
      // Mark current user ID in sessionStorage
      if (user?.id) {
        sessionStorage.setItem('current_user_id', user.id);
      }

      return {
        token: apiData.token,
        user: user,
      };
    } catch (error) {
      // Log error theo cấu trúc backend
      if (import.meta.env.VITE_ENV === "development") {
        const errorData = error?.response?.data || {};
        console.error('❌ Register error:', {
          status: error?.response?.status,
          code: errorData?.errorCode || errorData?.Code,
          message: errorData?.errorMessage || errorData?.Message || errorData?.message,
          url: error?.config?.url,
          data: errorData,
        });
      }
      throw error;
    }
  },
  async generateVerificationToken() {
    try {
      const response = await authApi.generateVerificationToken();
      const apiData = response.data.data;
      return apiData.token;
    } catch (error) {
      // Log error theo cấu trúc backend
      if (import.meta.env.VITE_ENV === "development") {
        const errorData = error?.response?.data || {};
        console.error('❌ Generate verification token error:', {
          status: error?.response?.status,
          code: errorData?.errorCode || errorData?.Code,
          message: errorData?.errorMessage || errorData?.Message || errorData?.message,
          url: error?.config?.url,
          data: errorData,
        });
      }
      throw error;
    }
  },
  async verifyEmail(token){
    try {
      const response = await authApi.verifyEmail(token);
      const apiData = response.data;
    } catch (error) {
      // Log error theo cấu trúc backend
      if (import.meta.env.VITE_ENV === "development") {
        const errorData = error?.response?.data || {};
        console.error('❌ Verify email error:', {
          status: error?.response?.status,
          code: errorData?.errorCode || errorData?.Code,
          message: errorData?.errorMessage || errorData?.Message || errorData?.message,
          url: error?.config?.url,
          data: errorData,
        });
      }
      throw error;
    }
  },
  // Logout
  async logout() {
    try {
      // Try to call API logout
      await authApi.logout();
    } catch (error) {
      // Log error theo cấu trúc backend
      if (import.meta.env.VITE_ENV === "development") {
        const errorData = error?.response?.data || {};
        console.error('❌ Logout API error:', {
          status: error?.response?.status,
          code: errorData?.errorCode || errorData?.Code,
          message: errorData?.errorMessage || errorData?.Message || errorData?.message,
          url: error?.config?.url,
          data: errorData,
        });
      }
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
      // Log error theo cấu trúc backend
      if (import.meta.env.VITE_ENV === "development") {
        const errorData = error?.response?.data || {};
        console.error('❌ Refresh token error:', {
          status: error?.response?.status,
          code: errorData?.errorCode || errorData?.Code,
          message: errorData?.errorMessage || errorData?.Message || errorData?.message,
          url: error?.config?.url,
          data: errorData,
        });
      }
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
    clearAuthData(); // This now clears sessionStorage too
    window.location.href = '/login';
  },
};
