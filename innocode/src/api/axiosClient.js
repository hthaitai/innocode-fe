import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://innocode-challenge-api.onrender.com/api",
  headers: { 
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Chỉ attach token nếu có và không phải request login/register
    const token = localStorage.getItem("token");
    const isAuthRequest = config.url?.includes('/auth/login') || 
                         config.url?.includes('/auth/register');
    
    if (token && !isAuthRequest && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request trong development
    if (import.meta.env.VITE_ENV === 'development') {
      console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_ENV === 'development') {
      console.log('📥 Response:', response.config.url, response.status);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (import.meta.env.VITE_ENV === 'development') {
        console.error('❌ Error:', status, error.config.url, data);
      }
      
      switch (status) {
        case 401:
          // Chỉ logout nếu không phải login request
          const isLoginRequest = error.config.url?.includes('/auth/login');
          if (!isLoginRequest) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
          break;
        case 403:
          console.error("Access denied");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          break;
      }
    } else if (error.request) {
      console.error("Network error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
