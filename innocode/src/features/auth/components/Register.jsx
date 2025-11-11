import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import InnoCodeLogo from '@/assets/InnoCode_Logo.jpg';
import { useAuth } from '@/context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typedText, setTypedText] = useState('');

  const fullText = 'Join InnoCode Platform';

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setTimeout(() => {
          currentIndex = 0;
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  // Validation
  const validateForm = () => {
    const errors = {};

    // Full name validation
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Password must contain uppercase, lowercase and number';
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });

      // Redirect to login or dashboard after successful registration
      navigate('/login', {
        state: { message: 'Registration successful! Please sign in.' },
      });
    } catch (err) {
      console.error('Registration error:', err);
      console.error('❌ Full error object:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.response?.data?.message,
        errorMessage: err.response?.data?.errorMessage,
        errorCode: err.response?.data?.errorCode,
        errors: err.response?.data?.errors,
      });

      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError(
          'Request timeout. Please check your connection and try again.'
        );
      } else if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;
        const errorMessage = err.response.data?.errorMessage; // Backend format
        const errorCode = err.response.data?.errorCode;
        const errors = err.response.data?.errors;

        // Handle validation errors from backend
        if (errors && typeof errors === 'object') {
          setValidationErrors(errors);
        }

        // Handle specific error codes
        if (errorCode === 'EMAIL_EXISTS') {
          setError('Email already exists. Please use a different email or login.');
          return;
        }

        switch (status) {
          case 400:
            setError(
              errorMessage || message || 'Invalid registration data. Please check your input.'
            );
            break;
          case 409:
            setError('Email already exists. Please use a different email.');
            break;
          case 422:
            setError('Validation failed. Please check your input.');
            break;
          case 500:
            // Extract error message from backend
            const serverError = err.response.data?.error || 'Server error. Please try again later.';
            setError(serverError);
            break;
          default:
            setError(errorMessage || message || 'An error occurred. Please try again.');
        }
      } else if (err.request) {
        setError(
          'Cannot connect to server. Please check your internet connection.'
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
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
          <h1 className="login-title">Create Account</h1>

          <form onSubmit={handleSubmit} className="login-form-content">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`form-input ${
                  validationErrors.fullName ? 'border-red-500' : ''
                }`}
                autoComplete="name"
                required
              />
              {validationErrors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`form-input ${
                  validationErrors.email ? 'border-red-500' : ''
                }`}
                autoComplete="email"
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
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
                className={`form-input ${
                  validationErrors.password ? 'border-red-500' : ''
                }`}
                autoComplete="new-password"
                required
              />
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.password}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Min 8 characters with uppercase, lowercase and number
              </p>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <div className="password-header">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`form-input ${
                  validationErrors.confirmPassword ? 'border-red-500' : ''
                }`}
                autoComplete="new-password"
                required
              />
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="signin-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">OR</span>
          </div>
          <div className="signup-link">
            Already have an account?{' '}
            <Link to="/login" className="signup-text">
              Sign In
            </Link>
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
            Start Your Programming Journey Today
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
