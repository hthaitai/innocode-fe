import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import "./RoleRegistration.css";
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg";
import { useCreateRoleRegistrationMutation } from "@/services/roleRegistrationApi";
import { Icon } from "@iconify/react";

const RoleRegistration = () => {
  const navigate = useNavigate();
  const [requestedRole, setRequestedRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [payload, setPayload] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [typedText, setTypedText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // RTK Query mutation
  const [createRoleRegistration, { isLoading: isSubmitting }] =
    useCreateRoleRegistrationMutation();

  const fullText = "Register as Professional";

  const roles = [
    { value: "judge", label: "Judge" },
    { value: "organizer", label: "Organizer" },
    { value: "schoolManager", label: "School Manager" },
    { value: "staff", label: "Staff" },
  ];

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

    if (!requestedRole) {
      errors.requestedRole = "Please select a role";
    }

    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }

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

    if (evidenceFiles.length === 0) {
      errors.evidenceFiles = "At least one evidence file is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEvidenceFiles(files);
    if (validationErrors.evidenceFiles) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.evidenceFiles;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("RequestedRole", requestedRole);
      formData.append("FullName", fullName.trim());
      formData.append("Email", email.trim());
      formData.append("Password", password);
      formData.append("ConfirmPassword", confirmPassword);

      if (phone.trim()) {
        formData.append("Phone", phone.trim());
      }

      if (payload.trim()) {
        formData.append("Payload", payload.trim());
      }

      // Append evidence files
      evidenceFiles.forEach((file) => {
        formData.append("EvidenceFiles", file);
      });

      const response = await createRoleRegistration(formData).unwrap();
      console.log("Registration response:", response);

      setSuccessMessage(
        "Registration successful! Your request has been submitted and is pending approval. Please wait for approval."
      );

      // Reset form
      setRequestedRole("");
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
      setPayload("");
      setEvidenceFiles([]);
    } catch (err) {
      console.error("Registration error:", err);

      // RTK Query error structure: err.data, err.status, err.originalStatus
      const errorData = err?.data || err?.response?.data;
      const status = err?.status || err?.originalStatus || err?.response?.status;
      
      // Lấy các thông báo lỗi từ nhiều nguồn khác nhau
      const errorMessage = errorData?.errorMessage;
      const message = errorData?.message;
      const error = errorData?.error;
      const errors = errorData?.errors;

      // Hiển thị lỗi validation từ server (có thể là object hoặc array)
      if (errors) {
        if (typeof errors === "object" && !Array.isArray(errors)) {
          // Merge với validation errors hiện tại
          setValidationErrors((prev) => ({ ...prev, ...errors }));
        } else if (Array.isArray(errors)) {
          // Nếu là array, chuyển thành object với key là field name
          const errorsObj = {};
          errors.forEach((errorItem) => {
            if (errorItem.field) {
              errorsObj[errorItem.field] = errorItem.message || errorItem;
            }
          });
          if (Object.keys(errorsObj).length > 0) {
            setValidationErrors((prev) => ({ ...prev, ...errorsObj }));
          }
        }
      }

      // Xử lý các loại lỗi khác nhau
      if (err?.code === "ECONNABORTED" || err?.message?.includes("timeout")) {
        setError(
          "Request timeout. Please check your connection and try again."
        );
      } else if (status) {
        // Ưu tiên hiển thị errorMessage từ API
        let displayError = errorMessage || message || error;
        
        switch (status) {
          case 400:
            setError(
              displayError ||
                "Invalid registration data. Please check your input."
            );
            break;
          case 409:
            // Xử lý lỗi email đã tồn tại
            if (errorData?.errorCode === "EMAIL_EXISTS" || errorMessage) {
              const emailErrorMsg = errorMessage || "Email already exists. Please use a different email.";
              setError(emailErrorMsg);
              // Cũng hiển thị lỗi ở field email
              setValidationErrors((prev) => ({
                ...prev,
                email: emailErrorMsg,
              }));
            } else {
              setError("Email already exists. Please use a different email.");
            }
            break;
          case 422:
            setError(
              displayError ||
                "Validation failed. Please check your input fields above."
            );
            break;
          case 500:
            setError(
              displayError ||
                "Server error. Please try again later."
            );
            break;
          default:
            setError(
              displayError ||
                "An error occurred. Please try again."
            );
        }
      } else if (err?.request || err?.message?.includes("Network")) {
        setError(
          "Cannot connect to server. Please check your internet connection."
        );
      } else {
        // Hiển thị bất kỳ thông báo lỗi nào có sẵn
        setError(
          errorMessage ||
            message ||
            error ||
            err?.message ||
            "An unexpected error occurred. Please try again."
        );
      }
    }
  };

  return (
    <div className="login-container relative">
      <div className="login-form-container role-registration-container">
        <Link to="/" className="absolute top-4 left-4 w-[60px] h-[60px] z-10">
          <img
            src={InnoCodeLogo}
            alt="InnoCode"
            className="w-full h-full object-contain"
          />
        </Link>
        <div className="login-form role-registration-form">
          <h1
            className="login-title"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              marginBottom: "2rem",
            }}
          >
            Role Registration
          </h1>

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
                  <p className="font-semibold text-green-800">
                    Registration Successful!
                  </p>
                  <p className="text-green-700 mt-1">{successMessage}</p>
                  <p className="text-green-600 mt-2 text-xs italic">
                    ⏳ Please wait for approval. You will receive an email
                    notification once your request is reviewed.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="login-form-content"
            style={{ display: successMessage ? "none" : "block" }}
          >
            {/* Role Selection */}
            <div className="form-group">
              <label htmlFor="requestedRole" className="form-label">
                Role <span style={{ color: "red" }}>*</span>
              </label>
              <select
                id="requestedRole"
                value={requestedRole}
                onChange={(e) => {
                  setRequestedRole(e.target.value);
                  if (validationErrors.requestedRole) {
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.requestedRole;
                      return newErrors;
                    });
                  }
                }}
                className={`form-input ${
                  validationErrors.requestedRole ? "border-red-500 ring-1 ring-red-200" : ""
                }`}
                required
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {validationErrors.requestedRole && (
                <div className="flex items-center gap-1 mt-1">
                  <Icon icon="mdi:alert-circle" className="text-red-500 text-sm" width="16" />
                  <p className="text-red-500 text-xs">
                    {validationErrors.requestedRole}
                  </p>
                </div>
              )}
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                Full Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (validationErrors.fullName) {
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.fullName;
                      return newErrors;
                    });
                  }
                }}
                className={`form-input ${
                  validationErrors.fullName ? "border-red-500 ring-1 ring-red-200" : ""
                }`}
                autoComplete="name"
                required
              />
              {validationErrors.fullName && (
                <div className="flex items-center gap-1 mt-1">
                  <Icon icon="mdi:alert-circle" className="text-red-500 text-sm" width="16" />
                  <p className="text-red-500 text-xs">
                    {validationErrors.fullName}
                  </p>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.email;
                      return newErrors;
                    });
                  }
                }}
                className={`form-input ${
                  validationErrors.email ? "border-red-500 ring-1 ring-red-200" : ""
                }`}
                autoComplete="email"
                required
              />
              {validationErrors.email && (
                <div className="flex items-center gap-1 mt-1">
                  <Icon icon="mdi:alert-circle" className="text-red-500 text-sm" width="16" />
                  <p className="text-red-500 text-xs">
                    {validationErrors.email}
                  </p>
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                autoComplete="tel"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password" className="form-label">
                  Password <span style={{ color: "red" }}>*</span>
                </label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  <Icon
                    icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                    width="20"
                  />
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.password;
                      return newErrors;
                    });
                  }
                }}
                className={`form-input ${
                  validationErrors.password ? "border-red-500 ring-1 ring-red-200" : ""
                }`}
                autoComplete="new-password"
                required
              />
              {validationErrors.password && (
                <div className="flex items-center gap-1 mt-1">
                  <Icon icon="mdi:alert-circle" className="text-red-500 text-sm" width="16" />
                  <p className="text-red-500 text-xs">
                    {validationErrors.password}
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Minimum 8 characters with uppercase, lowercase and number
              </p>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <div className="password-header">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span style={{ color: "red" }}>*</span>
                </label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: "pointer" }}
                >
                  <Icon
                    icon={showConfirmPassword ? "mdi:eye-off" : "mdi:eye"}
                    width="20"
                  />
                </button>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (validationErrors.confirmPassword) {
                    setValidationErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.confirmPassword;
                      return newErrors;
                    });
                  }
                }}
                className={`form-input ${
                  validationErrors.confirmPassword ? "border-red-500 ring-1 ring-red-200" : ""
                }`}
                autoComplete="new-password"
                required
              />
              {validationErrors.confirmPassword && (
                <div className="flex items-center gap-1 mt-1">
                  <Icon icon="mdi:alert-circle" className="text-red-500 text-sm" width="16" />
                  <p className="text-red-500 text-xs">
                    {validationErrors.confirmPassword}
                  </p>
                </div>
              )}
            </div>

            {/* Payload */}
            <div className="form-group">
              <label htmlFor="payload" className="form-label">
                Additional Information
              </label>
              <textarea
                id="payload"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="form-input"
                rows="3"
                placeholder="Enter additional information (optional)"
              />
            </div>

            {/* Evidence Files */}
            <div className="form-group">
              <label htmlFor="evidenceFiles" className="form-label">
                Evidence Documents <span style={{ color: "red" }}>*</span>
              </label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="evidenceFiles"
                  multiple
                  onChange={handleFileChange}
                  className={`file-input ${
                    validationErrors.evidenceFiles ? "border-red-500 ring-1 ring-red-200" : ""
                  }`}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  required
                />
                <label htmlFor="evidenceFiles" className="file-input-label">
                  <Icon
                    icon="mdi:upload"
                    width="20"
                    style={{ marginRight: "0.5rem" }}
                  />
                  {evidenceFiles.length > 0
                    ? `${evidenceFiles.length} file(s) selected`
                    : "Choose files"}
                </label>
              </div>
              {validationErrors.evidenceFiles && (
                <div className="flex items-center gap-1 mt-1">
                  <Icon icon="mdi:alert-circle" className="text-red-500 text-sm" width="16" />
                  <p className="text-red-500 text-xs">
                    {validationErrors.evidenceFiles}
                  </p>
                </div>
              )}
              {evidenceFiles.length > 0 && (
                <div className="file-list mt-2">
                  {evidenceFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <Icon icon="mdi:file-document" width="16" />
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Accepted formats: PDF, DOC, DOCX, JPG, JPEG, PNG
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                <div className="flex items-start gap-2">
                  <Icon icon="mdi:alert-circle" className="text-red-600 mt-0.5 flex-shrink-0" width="20" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-800 mb-1">Error</p>
                    <p className="text-red-700">{error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError("")}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="Close error"
                  >
                    <Icon icon="mdi:close" width="18" />
                  </button>
                </div>
              </div>
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
                  <span>Registering...</span>
                </div>
              ) : (
                "Register"
              )}
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
          <p className="typing-subtitle">Join Our Professional Community</p>
        </div>
      </div>
    </div>
  );
};

export default RoleRegistration;
