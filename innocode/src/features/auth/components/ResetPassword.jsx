import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './Login.css';
import InnoCodeLogo from '@/assets/InnoCode_Logo.jpg';
import { authApi } from '@/api/authApi';
import { Icon } from '@iconify/react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Reset token is missing. Please check your email link.');
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors = {};

    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase and number';
    }

    if (!confirmNewPassword) {
      errors.confirmNewPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    if (!token) {
      setError('Reset token is missing. Please check your email link.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.resetPassword({
        token: token,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      });
      setSuccess(true);
    } catch (err) {
      console.error('Reset password error:', err);
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('Request timeout. Please check your connection and try again.');
      } else if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.errorMessage;

        switch (status) {
          case 400:
            setError(message || 'Invalid reset token or password. Please try again.');
            break;
          case 404:
            setError('Reset token not found or expired. Please request a new password reset.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(message || 'An error occurred. Please try again.');
        }
      } else if (err.request) {
        setError('Cannot connect to server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
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
            <h1 className="login-title">Password Reset Successful</h1>
            <div className="login-form-content">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm mb-4">
                Your password has been reset successfully. You can now sign in with your new password.
              </div>
              <button
                onClick={() => navigate('/login')}
                className="signin-button"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
        <div className="login-background">
          <div className="typing-container">
            <h1 className="typing-text">
              Password Reset
            </h1>
            <p className="typing-subtitle">
              Your account is ready to use
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="login-title">Reset Password</h1>

          <form onSubmit={handleSubmit} className="login-form-content">
            <p className="text-sm text-[#7A7574] mb-4">
              Enter your new password below.
            </p>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  <Icon 
                    icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} 
                    width="20" 
                  />
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`form-input ${
                  validationErrors.newPassword ? 'border-red-500' : ''
                }`}
                autoComplete="new-password"
                required
                disabled={isSubmitting}
              />
              {validationErrors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.newPassword}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Min 8 characters with uppercase, lowercase and number
              </p>
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="confirmNewPassword" className="form-label">
                  Confirm New Password
                </label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  <Icon 
                    icon={showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'} 
                    width="20" 
                  />
                </button>
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className={`form-input ${
                  validationErrors.confirmNewPassword ? 'border-red-500' : ''
                }`}
                autoComplete="new-password"
                required
                disabled={isSubmitting}
              />
              {validationErrors.confirmNewPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.confirmNewPassword}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="signin-button"
              disabled={isSubmitting || !token}
            >
              {isSubmitting ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Resetting...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">OR</span>
          </div>

          <div className="signup-link">
            Remember your password?{' '}
            <Link to="/login" className="signup-text">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      <div className="login-background">
        <div className="typing-container">
          <h1 className="typing-text">
            Reset Password
          </h1>
          <p className="typing-subtitle">
            Create a new secure password
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

