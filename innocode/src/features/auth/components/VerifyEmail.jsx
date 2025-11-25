import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '@/features/auth/services/authService';
import { Icon } from '@iconify/react';
import './Login.css';
import InnoCodeLogo from '@/assets/InnoCode_Logo.jpg';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing. Please check your email link.');
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('Email verified successfully! You can now sign in.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', {
            state: { message: 'Email verified successfully! Please sign in.' }
          });
        }, 3000);
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.errorMessage ||
                           'Failed to verify email. The link may have expired.';
        setMessage(errorMessage);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

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
        <div className="login-form" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="text-center py-8">
            {status === 'verifying' && (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#ff6b35] border-t-transparent mx-auto mb-4"></div>
                <h1 className="text-2xl font-bold mb-2">Verifying Email</h1>
                <p className="text-[#7A7574]">{message}</p>
              </>
            )}

            {status === 'success' && (
              <>
                <Icon 
                  icon="mdi:check-circle" 
                  width="64" 
                  className="text-green-500 mx-auto mb-4" 
                />
                <h1 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h1>
                <p className="text-[#7A7574] mb-4">{message}</p>
                <p className="text-sm text-[#7A7574]">Redirecting to login...</p>
              </>
            )}

            {status === 'error' && (
              <>
                <Icon 
                  icon="mdi:alert-circle" 
                  width="64" 
                  className="text-red-500 mx-auto mb-4" 
                />
                <h1 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h1>
                <p className="text-[#7A7574] mb-4">{message}</p>
                <button
                  onClick={() => navigate('/login')}
                  className="button-orange mt-4"
                >
                  Go to Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="login-background">
        <div className="typing-container">
          <h1 className="typing-text">
            Email Verification
          </h1>
          <p className="typing-subtitle">
            Verify your account to get started
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
