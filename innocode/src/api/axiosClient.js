import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.example.com",
  headers: { "Content-Type": "application/json" },
});

// Optionally add interceptors (for auth, error handling, etc.)
axiosClient.interceptors.request.use(config => {
  // e.g., attach token
  // config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

axiosClient.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export default axiosClient;
