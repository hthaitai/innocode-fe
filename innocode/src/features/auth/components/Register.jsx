import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg";
import { useAuth } from "@/context/AuthContext";
import { schoolApi } from "@/api/schoolApi";
import { authService } from "../services/authService";
import {
  sendVerificationEmail,
  initEmailJs,
} from "@/shared/services/emailService";
import { Icon } from "@iconify/react";

const Register = () => {
  const { register, clearAuth } = useAuth(); // Dùng clearAuth thay vì logout
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [grade, setGrade] = useState("");
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [successMessage, setSuccessMessage] = useState(''); 

  const fullText = "Join InnoCode Platform";

  useEffect(() => {
    const fetchSchools = async () => {
      setLoadingSchools(true);
      try {
        const response = await schoolApi.getAll();
        // Handle different response structures
        const schoolsData = response.data?.data || response.data || [];
        console.log("Schools data:", schoolsData);
        if (schoolsData.length > 0) {
          console.log("First school structure:", schoolsData[0]);
        }
        setSchools(schoolsData);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setError("Failed to load schools. Please refresh the page.");
      } finally {
        setLoadingSchools(false);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    initEmailJs();
  }, []);

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

  const validateForm = () => {
    const errors = {};

    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }

    // Email validation
    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = "Password must contain uppercase, lowercase and number";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!schoolId) {
      errors.schoolId = "School is required";
    }

    if (!grade) {
      errors.grade = "Grade is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});
    setSuccessMessage(""); 

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const registerResult = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        schoolId: schoolId,
        grade: grade.trim(),
      }, false); 

      const token = localStorage.getItem("token");
      if (!token || token === "null") {
        throw new Error("Token not found after registration");
      }

      let verificationToken;
      try {
        verificationToken = await authService.generateVerificationToken();
      } catch (verifyError) {
        clearAuth();
        console.error("❌ Error generating verification token:", verifyError);
        const errorMessage =
          verifyError.response?.data?.message ||
          verifyError.response?.data?.errorMessage ||
          "Couldn't generate verification token";
        console.error("Error details:", errorMessage);
        setError(`Registration successful! However, we couldn't generate verification token: ${errorMessage}. Please contact support.`);
        return; 
      }

      clearAuth();

      try {
        await sendVerificationEmail({
          toEmail: email.trim(),
          verificationToken: verificationToken,
          fullName: fullName.trim(),
        });
        console.log("✅ Verification email sent successfully");

        setSuccessMessage("Account registration successful! Please check your email to activate your account before signing in.");
        // Reset form
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setSchoolId("");
        setGrade("");
      } catch (emailError) {
        console.error("❌ Error sending verification email:", emailError);
        setError("Registration successful! However, we couldn't send verification email. Please contact support or try to resend verification email.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      console.error("❌ Full error object:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.response?.data?.message,
        errorMessage: err.response?.data?.errorMessage,
        errorCode: err.response?.data?.errorCode,
        errors: err.response?.data?.errors,
      });

      if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
        setError(
          "Request timeout. Please check your connection and try again."
        );
      } else if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;
        const errorMessage = err.response.data?.errorMessage; // Backend format
        const errorCode = err.response.data?.errorCode;
        const errors = err.response.data?.errors;

        // Handle validation errors from backend
        if (errors && typeof errors === "object") {
          setValidationErrors(errors);
        }

        // Handle specific error codes
        if (errorCode === "EMAIL_EXISTS") {
          setError(
            "Email already exists. Please use a different email or login."
          );
          return;
        }

        switch (status) {
          case 400:
            setError(
              errorMessage ||
                message ||
                "Invalid registration data. Please check your input."
            );
            break;
          case 409:
            setError("Email already exists. Please use a different email.");
            break;
          case 422:
            setError("Validation failed. Please check your input.");
            break;
          case 500:
            // Extract error message from backend
            const serverError =
              err.response.data?.error ||
              "Server error. Please try again later.";
            setError(serverError);
            break;
          default:
            setError(
              errorMessage || message || "An error occurred. Please try again."
            );
        }
      } else if (err.request) {
        setError(
          "Cannot connect to server. Please check your internet connection."
        );
      } else {
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
          <h1 className="login-title">Create Account</h1>

          {/* Success Message - Hiển thị ở đây nếu thành công */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm mb-4">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-green-800">Registration Successful!</p>
                  <p className="text-green-700 mt-1">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form-content" style={{ display: successMessage ? 'none' : 'block' }}>
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
                  validationErrors.fullName ? "border-red-500" : ""
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
                  validationErrors.email ? "border-red-500" : ""
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

            {/* School Dropdown */}
            <div className="form-group">
              <label htmlFor="school" className="form-label">
                School
              </label>
              <select
                id="school"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className={`form-input ${
                  validationErrors.schoolId ? "border-red-500" : ""
                }`}
                required
                disabled={loadingSchools}
              >
                <option value="">Select a school</option>
                {schools.map((school) => (
                  <option
                    key={school.id || school.schoolId || school.school_id}
                    value={school.id || school.schoolId || school.school_id}
                  >
                    {school.name}
                  </option>
                ))}
              </select>
              {validationErrors.schoolId && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.schoolId}
                </p>
              )}
              {loadingSchools && (
                <p className="text-xs text-gray-500 mt-1">Loading schools...</p>
              )}
            </div>

            {/* Grade */}
            <div className="form-group">
              <label htmlFor="grade" className="form-label">
                Grade
              </label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className={`form-input ${
                  validationErrors.grade ? "border-red-500" : ""
                }`}
                required
              >
                <option value="">Select a grade</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
              {validationErrors.grade && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.grade}
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
                  style={{ cursor: 'pointer' }}
                >
                  <Icon 
                    icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'} 
                    width="20" 
                  />
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-input ${
                  validationErrors.password ? "border-red-500" : ""
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
                  style={{ cursor: 'pointer' }}
                >
                  <Icon 
                    icon={showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'} 
                    width="20" 
                  />
                </button>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`form-input ${
                  validationErrors.confirmPassword ? "border-red-500" : ""
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

            {/* Error Message */}
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
              {isSubmitting ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">OR</span>
          </div>
          <div className="signup-link">
            Already have an account?{" "}
            <Link to="/login" className="signup-text">
              Sign In
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
            Start Your Programming Journey Today
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
