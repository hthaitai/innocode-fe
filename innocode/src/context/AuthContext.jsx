import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react"
import { authService } from "@/features/auth/services/authService"
import { shouldRefreshToken } from "@/shared/utils/jwtUtils"
// Xóa dòng import useNavigate
// import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null)

// Token refresh check interval (check every 1 minute)
const TOKEN_CHECK_INTERVAL = 60 * 1000 // 1 minute
// Refresh token if it expires within 5 minutes (industry standard)
const REFRESH_THRESHOLD_MINUTES = 5

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true) // Thêm loading state
  const refreshIntervalRef = useRef(null)
  // Xóa dòng này: const navigate = useNavigate();

  // Stop automatic token refresh interval
  const stopTokenRefreshInterval = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
    }
  }, [])

  // Automatic token refresh function
  const refreshTokenIfNeeded = useCallback(async () => {
    try {
      const currentToken = authService.getToken()

      // Only refresh if user is authenticated and has a token
      if (!currentToken || !authService.isAuthenticated()) {
        return
      }

      // Check if token should be refreshed (expires within threshold)
      if (shouldRefreshToken(currentToken, REFRESH_THRESHOLD_MINUTES)) {
        if (import.meta.env.VITE_ENV === "development") {
          console.log("🔄 Token expires soon, refreshing automatically...")
        }

        try {
          const data = await authService.refreshToken()
          setToken(data.token)
          setUser(data.user)
          // Mark current user ID in sessionStorage
          if (data.user?.id) {
            sessionStorage.setItem("current_user_id", data.user.id)
          }

          // Dispatch event to notify axiosClient and other listeners
          window.dispatchEvent(
            new CustomEvent("tokenRefreshed", {
              detail: { token: data.token },
            })
          )

          if (import.meta.env.VITE_ENV === "development") {
            console.log("✅ Token refreshed automatically")
          }
        } catch (refreshError) {
          console.error("❌ Automatic token refresh failed:", refreshError)
          // If refresh fails, clear tokens and redirect to login
          stopTokenRefreshInterval()
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("user")
          // Don't clear sessionStorage - allow user to continue after re-login
          // SessionStorage is marked with user ID and will be cleared if different user logs in
          setToken(null)
          setUser(null)
          window.location.href = "/login"
        }
      }
    } catch (error) {
      console.error("❌ Token refresh check error:", error)
    }
  }, [stopTokenRefreshInterval])

  // Start automatic token refresh interval
  const startTokenRefreshInterval = useCallback(() => {
    // Clear existing interval if any
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
    }

    // Check immediately
    refreshTokenIfNeeded()

    // Set up interval to check every minute
    refreshIntervalRef.current = setInterval(() => {
      refreshTokenIfNeeded()
    }, TOKEN_CHECK_INTERVAL)
  }, [refreshTokenIfNeeded])

  // Khôi phục auth state từ JWT token khi app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = authService.getToken()
        const refreshToken = authService.getRefreshToken()

        // If we have a token and it's valid, restore auth state
        if (storedToken && authService.isAuthenticated()) {
          const storedUser = authService.getUser()
          if (storedUser) {
            setToken(storedToken)
            setUser(storedUser)
            // Mark current user ID in sessionStorage
            if (storedUser?.id) {
              const previousUserId = sessionStorage.getItem("current_user_id")
              // If different user, clear previous user's data
              if (previousUserId && previousUserId !== storedUser.id) {
                // Import clearUserSessionData function (we'll need to export it)
                const sessionKeysToRemove = []
                for (let i = 0; i < sessionStorage.length; i++) {
                  const key = sessionStorage.key(i)
                  if (
                    key &&
                    (key.startsWith("round_timer_") ||
                      key.startsWith("openCode_") ||
                      key.startsWith("mcq_test_") ||
                      key.startsWith("code_") ||
                      key.startsWith("testResults_"))
                  ) {
                    sessionKeysToRemove.push(key)
                  }
                }
                sessionKeysToRemove.forEach((key) =>
                  sessionStorage.removeItem(key)
                )
              }
              sessionStorage.setItem("current_user_id", storedUser.id)
            }
            // Start automatic token refresh
            startTokenRefreshInterval()
          }
        }
        // If token is expired but we have refreshToken, try to refresh immediately
        else if (refreshToken && storedToken) {
          // Token exists but expired, try to refresh it
          try {
            if (import.meta.env.VITE_ENV === "development") {
              console.log(
                "🔄 Token expired, attempting to refresh on app load..."
              )
            }
            const data = await authService.refreshToken()
            setToken(data.token)
            setUser(data.user)
            // Mark current user ID in sessionStorage
            if (data.user?.id) {
              sessionStorage.setItem("current_user_id", data.user.id)
            }
            // Start automatic token refresh after successful refresh
            startTokenRefreshInterval()

            // Dispatch event to notify axiosClient
            window.dispatchEvent(
              new CustomEvent("tokenRefreshed", {
                detail: { token: data.token },
              })
            )
          } catch (refreshError) {
            console.error("❌ Initial token refresh failed:", refreshError)
            // If refresh fails, clear tokens but don't redirect (let user stay on page)
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("user")
            // Clear sessionStorage for current user only
            const currentUserId = sessionStorage.getItem("current_user_id")
            if (currentUserId) {
              const sessionKeysToRemove = []
              for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i)
                if (
                  key &&
                  (key.startsWith("round_timer_") ||
                    key.startsWith("openCode_") ||
                    key.startsWith("mcq_test_") ||
                    key.startsWith("code_") ||
                    key.startsWith("testResults_"))
                ) {
                  sessionKeysToRemove.push(key)
                }
              }
              sessionKeysToRemove.forEach((key) =>
                sessionStorage.removeItem(key)
              )
            }
            sessionStorage.removeItem("current_user_id")
            setToken(null)
            setUser(null)
          }
        }
        // If we have refreshToken but no token, try to refresh
        else if (refreshToken) {
          try {
            if (import.meta.env.VITE_ENV === "development") {
              console.log(
                "🔄 No token found, attempting to refresh using refreshToken..."
              )
            }
            const data = await authService.refreshToken()
            setToken(data.token)
            setUser(data.user)
            // Mark current user ID in sessionStorage
            if (data.user?.id) {
              sessionStorage.setItem("current_user_id", data.user.id)
            }
            // Start automatic token refresh after successful refresh
            startTokenRefreshInterval()

            // Dispatch event to notify axiosClient
            window.dispatchEvent(
              new CustomEvent("tokenRefreshed", {
                detail: { token: data.token },
              })
            )
          } catch (refreshError) {
            console.error("❌ Initial token refresh failed:", refreshError)
            // If refresh fails, clear tokens
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("user")
            // Clear sessionStorage
            sessionStorage.clear()
            setToken(null)
            setUser(null)
          }
        }
      } catch (error) {
        console.error("❌ Initialize auth error:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Cleanup on unmount
    return () => {
      stopTokenRefreshInterval()
    }
  }, [startTokenRefreshInterval, stopTokenRefreshInterval])

  // Listen for token refresh events from axiosClient
  useEffect(() => {
    const handleTokenRefresh = (event) => {
      try {
        const newToken = event.detail?.token || authService.getToken()
        if (newToken && authService.isAuthenticated()) {
          const newUser = authService.getUser()
          if (newUser) {
            setToken(newToken)
            setUser(newUser)
            // Mark current user ID in sessionStorage
            if (newUser?.id) {
              sessionStorage.setItem("current_user_id", newUser.id)
            }
            if (import.meta.env.VITE_ENV === "development") {
              console.log("🔄 AuthContext updated after token refresh")
            }
          }
        }
      } catch (error) {
        console.error("❌ Token refresh handler error:", error)
      }
    }

    window.addEventListener("tokenRefreshed", handleTokenRefresh)

    return () => {
      window.removeEventListener("tokenRefreshed", handleTokenRefresh)
    }
  }, [])

  const login = async (credentials) => {
    const data = await authService.login(credentials)
    setToken(data.token)
    setUser(data.user)
    // Start automatic token refresh after login
    startTokenRefreshInterval()
    return data
  }

  const register = async (userData, autoLogin = false) => {
    const data = await authService.register(userData)
    // Chỉ tự động login nếu autoLogin = true (mặc định là false)
    // Điều này cho phép register mà không tự động đăng nhập
    if (autoLogin) {
      setToken(data.token)
      setUser(data.user)
      // Start automatic token refresh after auto login
      startTokenRefreshInterval()
    }
    return data
  }

  const logout = async () => {
    // Stop automatic token refresh
    stopTokenRefreshInterval()
    await authService.logout()
    setToken(null)
    setUser(null)
    // Thay đổi từ navigate('/login') thành:
    window.location.href = "/login"
  }

  // Clear auth state without redirect (useful for registration flow)
  const clearAuth = () => {
    // Stop automatic token refresh
    stopTokenRefreshInterval()
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  // Computed value: check if user is authenticated
  const isAuthenticated = !!token && !!user

  // Chờ loading xong mới render children
  if (loading) {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center text-white z-50"
        style={{
          background:
            "linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd89b 100%)",
        }}
      >
        {/* Animated bouncing dots */}
        <div className="flex space-x-3 mb-6">
          <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-0"></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-200"></div>
          <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-400"></div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold mb-2">Loading, please wait...</h1>
        <p className="text-lg opacity-90">
          Your experience will start shortly.
        </p>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
        clearAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
export const ROLES = {
  ADMIN: "admin",
  ORGANIZER: "organizer",
  STUDENT: "student",
  JUDGE: "judge",
  STAFF: "staff",
  MENTOR: "mentor",
  SCHOOL_MANAGER: "schoolmanager",
}
