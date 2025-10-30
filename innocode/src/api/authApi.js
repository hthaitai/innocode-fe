import axiosClient from "./axiosClient";

export const authApi = {
  // Login
  login: (credentials) => {
    return axiosClient.post("/auth/login", credentials);
  },
  // Register
  register: (userData) => {
    return axiosClient.post("/auth/register", userData);
  }
};
