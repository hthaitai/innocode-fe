import { useTranslation } from "react-i18next"
import "./Login.css"
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg"
import { authApi } from "@/api/authApi"
import { Icon } from "@iconify/react"
import translateApiError from "@/shared/utils/translateApiError"

const ResetPassword = () => {
  const { t } = useTranslation(["auth", "common"])
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError(t("auth:errors.tokenMissing"))
    }
  }, [searchParams])

  const validateForm = () => {
    const errors = {}

    if (!newPassword) {
      errors.newPassword = t("pages:register.passwordRequired")
    } else if (newPassword.length < 8) {
      errors.newPassword = t("pages:register.passwordMinLength")
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      errors.newPassword = t("pages:register.passwordRequirements")
    }

    if (!confirmNewPassword) {
      errors.confirmNewPassword = t("pages:register.confirmPasswordRequired")
    } else if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = t("pages:register.passwordsNotMatch")
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setValidationErrors({})

    if (!validateForm()) {
      return
    }

    if (!token) {
      setError(t("auth:errors.tokenMissing"))
      return
    }

    setIsSubmitting(true)

    try {
      await authApi.resetPassword({
        token: token,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      })
      setSuccess(true)
    } catch (err) {
      console.error("Reset password error:", err)
      const translatedError = translateApiError(err, "auth:errors")
      setError(translatedError)
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <h1 className="login-title">{t("auth:resetSuccessTitle")}</h1>
            <div className="login-form-content">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm mb-4">
                {t("auth:resetSuccessMessage")}
              </div>
              <button
                onClick={() => navigate("/login")}
                className="signin-button"
              >
                {t("auth:goToLogin")}
              </button>
            </div>
          </div>
        </div>
        <div className="login-background">
          <div className="typing-container">
            <h1 className="typing-text">{t("auth:resetPasswordTitle")}</h1>
            <p className="typing-subtitle">{t("auth:readyToUseSubtitle")}</p>
          </div>
        </div>
      </div>
    )
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
          <h1 className="login-title">{t("auth:resetPasswordTitle")}</h1>

          <form onSubmit={handleSubmit} className="login-form-content">
            <p className="text-sm text-[#7A7574] mb-4">
              {t("auth:resetPasswordIntro")}
            </p>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="newPassword" className="form-label">
                  {t("auth:newPassword")}
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
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`form-input ${
                  validationErrors.newPassword ? "border-red-500" : ""
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
                {t("pages:register.passwordHint")}
              </p>
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="confirmNewPassword" className="form-label">
                  {t("auth:confirmNewPassword")}
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
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className={`form-input ${
                  validationErrors.confirmNewPassword ? "border-red-500" : ""
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t("auth:resetting")}</span>
                </div>
              ) : (
                t("auth:resetPasswordBtn")
              )}
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">{t("auth:or")}</span>
          </div>

          <div className="signup-link">
            {t("auth:rememberPasswordPrompt")}{" "}
            <Link to="/login" className="signup-text">
              {t("auth:signIn")}
            </Link>
          </div>
        </div>
      </div>
      <div className="login-background">
        <div className="typing-container">
          <h1 className="typing-text">{t("auth:resetPasswordTitle")}</h1>
          <p className="typing-subtitle">{t("auth:resetPasswordSubtitle")}</p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
