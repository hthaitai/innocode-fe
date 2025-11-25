import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import InnoCodeLogo from '@/assets/InnoCode_Logo.jpg';
import { authApi } from '@/api/authApi';
import { sendResetPasswordEmail } from '@/shared/services/emailService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.forgotPassword(email.trim());
      const resetToken = response.data?.data?.token;
      
      if (resetToken) {
        // Send reset password email with token
        try {
          await sendResetPasswordEmail({
            toEmail: email.trim(),
            resetToken: resetToken,
            fullName: '', // Could be fetched if needed
          });
          setSuccess('Password reset instructions have been sent to your email. Please check your inbox.');
          setEmail('');
        } catch (emailError) {
          console.error('Error sending reset password email:', emailError);
          setError('Password reset token generated, but we couldn\'t send the email. Please contact support.');
        }
      } else {
        // Even if token is null, show success message (security best practice)
        setSuccess('If the account exists, a reset token has been generated. Please check your email.');
        setEmail('');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('Request timeout. Please check your connection and try again.');
      } else if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message || err.response.data?.errorMessage;

        switch (status) {
          case 404:
            setError('Email not found. Please check your email address.');
            break;
          case 429:
            setError('Too many requests. Please try again later.');
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
          <h1 className="login-title">Forgot Password</h1>

          {success ? (
            <div className="login-form-content">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm mb-4">
                {success}
              </div>
              <button
                onClick={() => navigate('/login')}
                className="signin-button"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="login-form-content">
              <p className="text-sm text-[#7A7574] mb-4">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input ${error ? 'border-red-500' : ''}`}
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded text-sm mb-4">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="signin-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

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
            Reset Your Password
          </h1>
          <p className="typing-subtitle">
            We'll help you get back into your account
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

