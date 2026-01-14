import React from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import "@/styles/typography.css"

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  error,
  isSubmitting,
  onSubmit,
}) => {
  const { t } = useTranslation(["auth", "common"])

  return (
    <>
      <h1 className="text-title-1 text-black mb-6">{t("auth:signIn")}</h1>

      <form onSubmit={onSubmit} className="mb-4">
        <div className="mb-5">
          <label
            htmlFor="email"
            className="text-body-1-strong block text-black mb-2"
          >
            {t("auth:email")}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-body-1 w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#ff6b35] transition-colors box-border"
            autoComplete="email"
            placeholder={t("common:auth.emailPlaceholder")}
            required
          />
        </div>

        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="password"
              className="text-body-1-strong block text-black"
            >
              {t("auth:password")}
            </label>
            <button
              type="button"
              className="text-body-1-strong text-gray-500 hover:text-[#ff6b35] cursor-pointer bg-transparent border-none transition-colors flex items-center gap-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <>
                  <EyeOff size={16} />
                  <span>{t("auth:hide")}</span>
                </>
              ) : (
                <>
                  <Eye size={16} />
                  <span>{t("auth:show")}</span>
                </>
              )}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-body-1 w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#ff6b35] transition-colors box-border"
            autoComplete="current-password"
            placeholder={t("common:auth.passwordPlaceholder")}
            required
          />
          <Link
            to="/forgot-password"
            className="text-body-1 block text-right text-gray-500 no-underline mt-2 hover:text-[#ff6b35] hover:underline transition-colors"
          >
            {t("auth:forgotPassword")}
          </Link>
        </div>

        {error && (
          <div className="text-caption-1 text-red-500 mb-4 px-3 py-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="text-subtitle-2 w-full px-3 py-3 bg-gray-400 text-white border-none rounded-[20px] cursor-pointer transition-colors hover:bg-gray-600 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t("common:common.loading")}</span>
            </div>
          ) : (
            t("auth:signIn")
          )}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-body-1 px-4 text-gray-500">{t("auth:or")}</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <div className="text-body-1 text-center mb-4 text-gray-500">
        <p>{t("auth:studentSignUpPrompt")}</p>
        <a
          href="/register"
          className="text-body-1-stronger text-black no-underline hover:text-[#ff6b35] hover:underline transition-colors"
        >
          {t("auth:signUp")}
        </a>
      </div>

      <div className="text-body-1 text-center mb-4 text-gray-500 mt-2">
        {t("auth:registerForRole")}{" "}
        <Link
          to="/role-registration"
          className="text-body-1-stronger text-black no-underline hover:text-[#ff6b35] hover:underline transition-colors"
        >
          {t("auth:signUpHere")}
        </Link>
      </div>
    </>
  )
}

export default LoginForm
