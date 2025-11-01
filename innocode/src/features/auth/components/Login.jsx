import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg";
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const {login, isAuthenticated, loading} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Giả lập tài khoản: email: admin@gmail.com, password: 123456
  //   if (email === "student@gmail.com" && password === "123456") {
  //     localStorage.setItem("token", "mock-token");
  //     localStorage.setItem("role","student");
  //     localStorage.setItem("name","Ten la Student");
  //     setError("");
  //     navigate("/"); // hoặc trang bạn muốn chuyển đến sau đăng nhập
  //   }else if (email === "organizer@gmail.com" && password === "123456") { 
  //     localStorage.setItem("token", "mock-token");
  //     localStorage.setItem("role","organizer"); 
  //     localStorage.setItem("name","Ten la organizer");
  //     setError("");
  //     navigate("/"); // hoặc trang bạn muốn chuyển đến sau đăng nhập
  //   }
  //    else {
  //     setError("wrong email or password");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Gọi login từ AuthContext
      await login({ email, password });
      
      // Redirect based on role (optional)
      // const user = authService.getUser();
      // if (user.role === 'organizer') {
      //   navigate("/organizer/contests");
      // } else {
      //   navigate("/");
      // }
      
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || 
        "Wrong email or password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign in");
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
              <a href="#reset" className="reset-password-link">
                Reset password
              </a>
            </div>

            {error && (
              <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
            )}

            <button type="submit" className="signin-button">
              Sign in
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">OR</span>
          </div>

          <button onClick={handleGoogleSignIn} className="google-signin-button">
            <div className="google-icon">G</div>
            Continue with Google
          </button>

          <div className="signup-link">
            Don't have an account yet?{" "}
            <a href="#signup" className="signup-text">
              Sign Up
            </a>
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
      <div className="login-background"></div>
    </div>
  );
};

export default Login;
