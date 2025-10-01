import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  const handleGoogleSignIn = () => {
    console.log("Google sign in");
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-form">
          <h1 className="login-title">Sign in</h1>
          
          <form onSubmit={handleSubmit} className="login-form-content">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">Password</label>
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
                required
              />
              <a href="#reset" className="reset-password-link">Reset password</a>
            </div>

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
            Don't have an account yet? <a href="#signup" className="signup-text">Sign Up</a>
          </div>

          <div className="legal-text">
            By continuing, you agree to the <a href="#terms" className="legal-link">Terms of use</a> and <a href="#privacy" className="legal-link">Privacy Policy</a>.
          </div>
        </div>
      </div>
      <div className="login-background"></div>
    </div>
  );
};

export default Login;
