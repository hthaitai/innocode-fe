import axios from "axios"

const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://innocode-challenge-api.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// Flag to prevent infinite refresh loop
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Chỉ attach token nếu có và không phải request login/register/refresh
    const token = localStorage.getItem("token")
    const isAuthRequest =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("/auth/refresh")

    if (token && !isAuthRequest && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log request trong development
    if (import.meta.env.VITE_ENV === "development") {
      console.log("📤 Request:", config.method?.toUpperCase(), config.url)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_ENV === "development") {
      console.log("📥 Response:", response.config.url, response.status)
      // Log response data for debugging
      if (response.status >= 200 && response.status < 300) {
        console.log("✅ Success response for:", response.config.url, response.data)
      }
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response) {
      const { status, data } = error.response

      if (import.meta.env.VITE_ENV === "development") {
        console.error("❌ Error:", status, error.config?.url || error.config?.method, data)
        // Only log as error if status is actually an error
        if (status >= 400) {
          console.error("❌ HTTP Error Response:", {
            url: error.config?.url,
            method: error.config?.method,
            status: status,
            data: data
          })
        }
      }

      switch (status) {
        case 401:
          const isAuthRequest =
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register") ||
            originalRequest.url?.includes("/auth/refresh")

          // Don't try to refresh if it's an auth request
          if (isAuthRequest) {
            if (originalRequest.url?.includes("/auth/refresh")) {
              // Refresh token failed, logout user
              localStorage.removeItem("token")
              localStorage.removeItem("refreshToken")
              localStorage.removeItem("user") // Remove old user data if exists
              window.location.href = "/login"
            }
            return Promise.reject(error)
          }

          // If already refreshing, queue this request
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject })
            })
              .then(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                return axiosClient(originalRequest)
              })
              .catch(err => {
                return Promise.reject(err)
              })
          }

          // Try to refresh token
          const refreshToken = localStorage.getItem("refreshToken")
          if (refreshToken && refreshToken !== "null") {
            isRefreshing = true

            try {
              const response = await axios.post(
                `${axiosClient.defaults.baseURL}/auth/refresh`,
                { refreshToken },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )

              const apiData = response.data.data
              if (apiData.token) {
                localStorage.setItem("token", apiData.token)
                if (apiData.refreshToken) {
                  localStorage.setItem("refreshToken", apiData.refreshToken)
                }

                // Update original request with new token
                originalRequest.headers.Authorization = `Bearer ${apiData.token}`

                // Process queued requests
                processQueue(null, apiData.token)
                isRefreshing = false

                // Retry original request
                return axiosClient(originalRequest)
              }
            } catch (refreshError) {
              processQueue(refreshError, null)
              isRefreshing = false
              
              // Refresh failed, logout user
              localStorage.removeItem("token")
              localStorage.removeItem("refreshToken")
              localStorage.removeItem("user") // Remove old user data if exists
              window.location.href = "/login"
              return Promise.reject(refreshError)
            }
          } else {
            // No refresh token, logout user
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("user") // Remove old user data if exists
            window.location.href = "/login"
          }
          break
        case 403:
          console.error("Access denied")
          break
        case 404:
          console.error("Resource not found")
          break
        case 500:
          console.error("Server error")
          break
        default:
          break
      }
    } else if (error.request) {
      console.error("Network error:", error.message)
    }

    return Promise.reject(error)
  }
)

export default axiosClient
