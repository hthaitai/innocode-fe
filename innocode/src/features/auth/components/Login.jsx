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
      console.error("Login error:", err);

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
              <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
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
