import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import translateApiError from "@/shared/utils/translateApiError";
import "./Login.css";
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg";
import { useAuth } from "@/context/AuthContext";
const Login = () => {
  const { t } = useTranslation(["auth", "common"]);
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typedText, setTypedText] = useState("");

  const fullText = t("common:home.welcome");

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        // Reset animation after a pause
        setTimeout(() => {
          currentIndex = 0;
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      // Log error theo cấu trúc backend
      if (import.meta.env.VITE_ENV === "development") {
        const errorData = err?.response?.data || {};
        console.error("❌ Login error:", {
          status: err?.response?.status,
          code: errorData?.errorCode || errorData?.Code,
          message: errorData?.errorMessage || errorData?.Message || errorData?.message,
          url: err?.config?.url,
          data: errorData,
        });
      }

      // Xử lý các loại lỗi khác nhau
      // Use translateApiError to handle all error cases
      const translatedError = translateApiError(err, 'errors')
      setError(translatedError)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container relative">
      <div className="login-form-container">
        <Link to="/" className="absolute top-4 left-4 w-[60px] h-[60px]">
          <img
            src={InnoCodeLogo}
            alt="InnoCode"
            className="w-full h-full object-contain"
          />
        </Link>
        <div className="login-form">
          <h1 className="login-title">{t("auth:signIn")}</h1>

          <form onSubmit={handleSubmit} className="login-form-content">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t("auth:email")}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                autoComplete="email"
                placeholder={t("common:auth.emailPlaceholder")}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">
                  {t("auth:password")}
                </label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? t("auth:hide") : t("auth:show")}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                autoComplete="current-password"
                placeholder={t("common:auth.passwordPlaceholder")}
                required
              />
              <Link
                to="/forgot-password"
                className="reset-password-link"
                style={{ display: "block", textAlign: "right" }}
              >
                {t("auth:forgotPassword")}
              </Link>
            </div>

            {error && (
              <div 
                className="error-message"
                style={{ 
                  color: "#ef4444", 
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ flexShrink: 0 }}
                >
                  <path 
                    d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" 
                    stroke="#ef4444" 
                    strokeWidth="2"
                  />
                  <path 
                    d="M10 6V10M10 14H10.01" 
                    stroke="#ef4444" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="signin-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t("common:common.loading")}</span>
                </div>
              ) : (
                t("auth:signIn")
              )}
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">OR</span>
          </div>

          <div className="signup-link">
         <p> Student please sign up using the Sign Up option above. </p> 
            <a href="/register" className="signup-text">
              Sign Up
            </a>
          </div>

          <div className="signup-link" style={{ marginTop: "0.5rem" }}>
            Register for a role {" "}
            <Link to="/role-registration" className="signup-text">
              Sign up here
            </Link>
          </div>

          <div className="legal-text">
            By continuing, you agree to the{" "}
            <a href="#terms" className="legal-link">
              Terms of use
            </a>{" "}
            and{" "}
            <a href="#privacy" className="legal-link">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
      <div className="login-background">
        <div className="typing-container">
          <h1 className="typing-text">
            {typedText}
            <span className="typing-cursor">|</span>
          </h1>
          <p className="typing-subtitle">
            High School Programming Contest Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
