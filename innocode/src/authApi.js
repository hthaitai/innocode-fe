import axiosClient from "./axiosClient";

export const authApi = {
  // Login
  login: (credentials) => {
    return axiosClient.post("/auth/login", credentials);
  },
  // Register
  register: (userData) => {
    return axiosClient.post("/auth/register", userData);
  },
  // Logout
  logout: () => {
    return axiosClient.post("/auth/logout");
  },
  // Refresh token
  refresh: (refreshToken) => {
    return axiosClient.post("/auth/refresh", { refreshToken });
  },
  // Generate verification token 
  generateVerificationToken: () => {
    return axiosClient.post("/auth/generate-verification-token");
  },
  // Verify email with token
  verifyEmail: (token) => {
    return axiosClient.post("/auth/verify-email", { token });
  },
  // Forgot password
  forgotPassword: (email) => {
    return axiosClient.post("/auth/forgot-password", { email });
  },
  // Reset password
  resetPassword: (data) => {
    return axiosClient.post("/auth/reset-password", data);
  },
  // Change password
  changePassword: (data) => {
    return axiosClient.post("/auth/change-password", data);
  }
};
