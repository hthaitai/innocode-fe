import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import InnoCodeLogo from '@/assets/InnoCode_Logo.jpg';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/api/authApi';
const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  const fullText = 'Welcome to InnoCode Platform';

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
    setError('');
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);

      // Xử lý các loại lỗi khác nhau
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError(
          'Request timeout. Please check your connection and try again.'
        );
      } else if (err.response) {
        // Lỗi từ server (có response)
        const status = err.response.status;
        const message = err.response.data?.message;

        switch (status) {
          case 401:
            setError(message || 'Wrong email or password. Please try again.');
            break;
          case 403:
            setError('Account is disabled or not verified.');
            break;
          case 429:
            setError('Too many login attempts. Please try again later.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(message || 'An error occurred. Please try again.');
        }
      } else if (err.request) {
        // Request được gửi nhưng không nhận được response
        setError(
          'Cannot connect to server. Please check your internet connection.'
        );
      } else {
        // Lỗi khác
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
    
    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail.trim())) {
      setForgotPasswordError('Please enter a valid email address');
      return;
    }

    setIsSendingReset(true);

    try {
      await authApi.forgotPassword(forgotPasswordEmail.trim());
      setForgotPasswordSuccess('Password reset instructions have been sent to your email. Please check your inbox.');
      setForgotPasswordEmail('');
    } catch (err) {
      console.error('Forgot password error:', err);
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setForgotPasswordError('Request timeout. Please check your connection and try again.');
      } else if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.errorMessage;

        switch (status) {
          case 404:
            setForgotPasswordError('Email not found. Please check your email address.');
            break;
          case 429:
            setForgotPasswordError('Too many requests. Please try again later.');
            break;
          case 500:
            setForgotPasswordError('Server error. Please try again later.');
            break;
          default:
            setForgotPasswordError(message || 'An error occurred. Please try again.');
        }
      } else if (err.request) {
        setForgotPasswordError('Cannot connect to server. Please check your internet connection.');
      } else {
        setForgotPasswordError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSendingReset(false);
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
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="reset-password-link"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'right' }}
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>
            )}

            <button 
              type="submit" 
              className="signin-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Forgot Password Modal/Form */}
          {showForgotPassword && (
            <div 
              className="fixed inset-0 bg-black opacity-70 flex items-center justify-center z-50"
              onClick={() => {
                setShowForgotPassword(false);
                setForgotPasswordEmail('');
                setForgotPasswordError('');
                setForgotPasswordSuccess('');
              }}
            >
              <div 
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
                
                {forgotPasswordSuccess ? (
                  <div className="mb-4">
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                      {forgotPasswordSuccess}
                    </div>
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotPasswordSuccess('');
                      }}
                      className="button-orange w-full mt-4"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword}>
                    <p className="text-sm text-gray-600 mb-4">
                      Enter your email address and we'll send you instructions to reset your password.
                    </p>
                    
                    <div className="form-group">
                      <label htmlFor="forgotPasswordEmail" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        id="forgotPasswordEmail"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="form-input"
                        autoComplete="email"
                        required
                        disabled={isSendingReset}
                      />
                    </div>

                    {forgotPasswordError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm mb-4">
                        {forgotPasswordError}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setForgotPasswordEmail('');
                          setForgotPasswordError('');
                        }}
                        className="button-white flex-1"
                        disabled={isSendingReset}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="button-orange flex-1"
                        disabled={isSendingReset}
                      >
                        {isSendingReset ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Sending...</span>
                          </div>
                        ) : (
                          'Send Reset Link'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          <div className="divider">
            <span className="divider-text">OR</span>
          </div>

          <div className="signup-link">
            Don't have an account yet?{' '}
            <a href="/register" className="signup-text">
              Sign Up
            </a>
          </div>

          <div className="legal-text">
            By continuing, you agree to the{' '}
            <a href="#terms" className="legal-link">
              Terms of use
            </a>{' '}
            and{' '}
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
