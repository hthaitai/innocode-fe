import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        const storedUser = authService.getUser();
        
        console.log("🔍 Init Auth - Token:", token);
        console.log("🔍 Init Auth - User:", storedUser);
        
        if (token && storedUser && token !== 'null') {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("❌ Init auth error:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        // QUAN TRỌNG: Luôn set loading = false
        setLoading(false);
        console.log("✅ Init Auth completed");
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      console.log("📤 Login attempt:", credentials.email);
      
      const data = await authService.login(credentials);
      
      console.log("✅ Login successful:", data);
      
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const data = await authService.register(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } catch (error) {
      console.error("❌ Register failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  console.log("🎯 AuthContext state:", { user, loading, isAuthenticated });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};