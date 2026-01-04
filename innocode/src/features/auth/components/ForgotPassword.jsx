import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import "./Login.css"
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg"
import { authApi } from "@/api/authApi"
import { sendResetPasswordEmail } from "@/shared/services/emailService"
import translateApiError from "@/shared/utils/translateApiError"

const ForgotPassword = () => {
  const { t } = useTranslation(["auth", "common"])
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email.trim()) {
      setError(t("pages:register.emailRequired"))
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t("pages:register.emailInvalid"))
      return
    }

    setIsSubmitting(true)

    try {
      const response = await authApi.forgotPassword(email.trim())
      const resetToken = response.data?.data?.token

      if (resetToken) {
        // Send reset password email with token
        try {
          await sendResetPasswordEmail({
            toEmail: email.trim(),
            resetToken: resetToken,
            fullName: "", // Could be fetched if needed
          })
          setSuccess(t("auth:resetIndicator"))
          setEmail("")
        } catch (emailError) {
          console.error("Error sending reset password email:", emailError)
          setError(t("auth:errors.emailError"))
        }
      } else {
        // Even if token is null, show success message (security best practice)
        setSuccess(t("auth:genericSuccess"))
        setEmail("")
      }
    } catch (err) {
      console.error("Forgot password error:", err)
      const translatedError = translateApiError(err, "auth:errors")
      setError(translatedError)
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className="login-title">{t("auth:forgotPasswordTitle")}</h1>

          {success ? (
            <div className="login-form-content">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm mb-4">
                {success}
              </div>
              <button
                onClick={() => navigate("/login")}
                className="signin-button"
              >
                {t("auth:backToLogin")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="login-form-content">
              <p className="text-sm text-[#7A7574] mb-4">
                {t("auth:forgotPasswordPrompt")}
              </p>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  {t("auth:email")}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`form-input ${error ? "border-red-500" : ""}`}
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t("auth:sending")}</span>
                  </div>
                ) : (
                  t("auth:sendResetLink")
                )}
              </button>
            </form>
          )}

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
          <h1 className="typing-text">
            {t("auth:resetPasswordAnimationTitle")}
          </h1>
          <p className="typing-subtitle">
            {t("auth:resetPasswordAnimationSubtitle")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
