import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg";
import { useAuth } from "@/context/AuthContext";
const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typedText, setTypedText] = useState("");

  const fullText = "Welcome to InnoCode Platform";

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
      if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        setError(
          "Request timeout. Please check your connection and try again."
        );
      } else if (err.response) {
        // Lỗi từ server (có response)
        const status = err.response.status;
        const message = err.response.data?.message;

        switch (status) {
          case 401:
            setError(message || "Wrong email or password. Please try again.");
            break;
          case 403:
            setError("Account is disabled or not verified.");
            break;
          case 429:
            setError("Too many login attempts. Please try again later.");
            break;
          case 500:
            setError("Server error. Please try again later.");
            break;
          default:
            setError(message || "An error occurred. Please try again.");
        }
      } else if (err.request) {
        // Request được gửi nhưng không nhận được response
        setError(
          "Cannot connect to server. Please check your internet connection."
        );
      } else {
        // Lỗi khác
        setError("An unexpected error occurred. Please try again.");
      }
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
          <h1 className="login-title">Sign in</h1>

          <form onSubmit={handleSubmit} className="login-form-content">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                autoComplete="current-password"
                required
              />
              <Link
                to="/forgot-password"
                className="reset-password-link"
                style={{ display: "block", textAlign: "right" }}
              >
                Forgot password?
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
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
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
