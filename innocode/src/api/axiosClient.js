import axios from "axios";

const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://innocode-challenge-api.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Flag to prevent infinite refresh loop
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Chỉ attach token nếu có và không phải request login/register/refresh hoặc team-invites (public endpoints)
    const token = localStorage.getItem("token");
    const isAuthRequest =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("/auth/refresh");
    const isPublicTeamInviteRequest =
      config.url?.includes("/team-invites/accept") ||
      config.url?.includes("/team-invites/decline");
    const isRoleRegistrationRequest =
      config.url?.includes("/role-registrations");

    if (token && !isAuthRequest && !isPublicTeamInviteRequest && !isRoleRegistrationRequest && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add Accept-Language header for i18n support
    const currentLanguage = localStorage.getItem('i18nextLng') || 'en';
    config.headers['Accept-Language'] = currentLanguage;

    // Log request trong development
    if (import.meta.env.VITE_ENV === "development") {
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
    if (import.meta.env.VITE_ENV === "development") {
      // Log response data for debugging
      if (response.status >= 200 && response.status < 300) {

      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;

      if (import.meta.env.VITE_ENV === "development") {
        // Log error theo cấu trúc backend
        if (status >= 400) {
          console.error("❌ HTTP Error Response:", {
            url: error.config?.url,
            method: error.config?.method,
            status: status,
            code: data?.errorCode || data?.Code,
            message: data?.errorMessage || data?.Message || data?.message,
            data: data,
          });
        }
      }

      switch (status) {
        case 401:
          const isAuthRequest =
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register") ||
            originalRequest.url?.includes("/auth/refresh");
          const isPublicTeamInviteRequest =
            originalRequest.url?.includes("/team-invites/accept") ||
            originalRequest.url?.includes("/team-invites/decline");

          // ✅ Don't try to refresh if it's an auth request or public team invite request
          if (isAuthRequest || isPublicTeamInviteRequest) {
            if (originalRequest.url?.includes("/auth/refresh")) {
              // Refresh token failed, logout user
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }
            return Promise.reject(error);
          }

          // ✅ Check if this is a public route that should allow guest access
          const isPublicRoute =
            originalRequest.method?.toLowerCase() === "get" &&
            originalRequest.url?.includes("/contests") &&
            !originalRequest.url?.includes("/contests/my-contests") &&
            !originalRequest.url?.includes("/contests/participation") &&
            !originalRequest.url?.includes("/contests/advanced");

          // ✅ For public routes, don't redirect, just reject the error
          // This allows components to handle 401 gracefully for guest users
          if (isPublicRoute && !localStorage.getItem("token")) {
            return Promise.reject(error);
          }

          // If already refreshing, queue this request
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosClient(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          // Try to refresh token
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken && refreshToken !== "null") {
            isRefreshing = true;

            try {
              const response = await axios.post(
                `${axiosClient.defaults.baseURL}/auth/refresh`,
                { refreshToken },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              const apiData = response.data.data;
              if (apiData.token) {
                localStorage.setItem("token", apiData.token);
                if (apiData.refreshToken) {
                  localStorage.setItem("refreshToken", apiData.refreshToken);
                }

                // Dispatch custom event to notify AuthContext
                window.dispatchEvent(
                  new CustomEvent("tokenRefreshed", {
                    detail: { token: apiData.token },
                  })
                );

                // Update original request with new token
                originalRequest.headers.Authorization = `Bearer ${apiData.token}`;

                // Process queued requests
                processQueue(null, apiData.token);
                isRefreshing = false;

                // Retry original request
                return axiosClient(originalRequest);
              }
            } catch (refreshError) {
              processQueue(refreshError, null);
              isRefreshing = false;

              // Refresh failed, logout user
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user"); // Remove old user data if exists
              window.location.href = "/login";
              return Promise.reject(refreshError);
            }
          } else {
            // ✅ Only redirect if it's NOT a public route
            // For public routes, we already handled it above
            if (!isPublicRoute) {
              // No refresh token, logout user
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
            } else {
              // For public routes without token, just reject
              return Promise.reject(error);
            }
          }
          break;
        case 403:
          if (import.meta.env.VITE_ENV === "development") {
            console.error("❌ Access denied:", {
              url: error.config?.url,
              status: status,
              code: data?.Code || data?.errorCode,
              message: data?.Message || data?.message || data?.errorMessage,
              data: data,
            });
          }
          break;
        case 404:
          if (import.meta.env.VITE_ENV === "development") {
            console.error("❌ Resource not found:", {
              url: error.config?.url,
              status: status,
              code: data?.Code || data?.errorCode,
              message: data?.Message || data?.message || data?.errorMessage,
              data: data,
            });
          }
          break;
        case 500:
          if (import.meta.env.VITE_ENV === "development") {
            console.error("❌ Server error:", {
              url: error.config?.url,
              status: status,
              code: data?.Code || data?.errorCode,
              message: data?.Message || data?.message || data?.errorMessage,
              data: data,
            });
          }
          break;
        default:
          break;
      }
    } else if (error.request) {
      if (import.meta.env.VITE_ENV === "development") {
        console.error("❌ Network error:", {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
        });
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
