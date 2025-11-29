import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/features/auth/services/authService";
// Xóa dòng import useNavigate
// import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm loading state
  // Xóa dòng này: const navigate = useNavigate();

  // Khôi phục auth state từ JWT token khi app load
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = authService.getToken();

        // Check if token exists and is valid
        if (storedToken && authService.isAuthenticated()) {
          const storedUser = authService.getUser();
          if (storedUser) {
            setToken(storedToken);
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error("❌ Initialize auth error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData, autoLogin = false) => {
    const data = await authService.register(userData);
    // Chỉ tự động login nếu autoLogin = true (mặc định là false)
    // Điều này cho phép register mà không tự động đăng nhập
    if (autoLogin) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
    // Thay đổi từ navigate('/login') thành:
    window.location.href = "/login";
  };

  // Clear auth state without redirect (useful for registration flow)
  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  // Computed value: check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Chờ loading xong mới render children
  if (loading) {
    return <div>Loading...</div>; // Hoặc component Spinner
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, register, logout, clearAuth, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
export const ROLES = {
  ADMIN: "admin",
  ORGANIZER: "organizer",
  STUDENT: "student",
  JUDGE: "judge",
  STAFF: "staff",
  MENTOR: "mentor",
};
