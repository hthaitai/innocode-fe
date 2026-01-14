import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import translateApiError from "@/shared/utils/translateApiError"
import InnoCodeLogo from "@/assets/InnoCode_Logo.jpg"
import { useAuth } from "@/context/AuthContext"
import TypingBackground from "../components/TypingBackground"
import LoginForm from "../components/LoginForm"

const Login = () => {
  const { t } = useTranslation(["auth", "common"])
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [typedText, setTypedText] = useState("")

  const fullText = t("common:home.welcome")

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        // Reset animation after a pause
        setTimeout(() => {
          currentIndex = 0
        }, 2000)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await login({ email, password })
      navigate("/")
    } catch (err) {
      // Log error theo cấu trúc backend
      if (import.meta.env.VITE_ENV === "development") {
        const errorData = err?.response?.data || {}
        console.error("❌ Login error:", {
          status: err?.response?.status,
          code: errorData?.errorCode || errorData?.Code,
          message:
            errorData?.errorMessage || errorData?.Message || errorData?.message,
          url: err?.config?.url,
          data: errorData,
        })
      }

      // Xử lý các loại lỗi khác nhau
      // Use translateApiError to handle all error cases
      const translatedError = translateApiError(err, "errors")
      setError(translatedError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen w-full relative animate-fadeIn">
      <div className="flex-1 bg-white flex items-center justify-center p-8 overflow-y-auto overflow-x-hidden relative animate-slideInLeft scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-gray-100">
        <Link to="/" className="absolute top-4 left-4 w-[60px] h-[60px]">
          <img
            src={InnoCodeLogo}
            alt="InnoCode"
            className="w-full h-full object-contain"
          />
        </Link>
        <div className="w-full max-w-[400px] p-0 min-h-fit mx-auto">
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            error={error}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
      <TypingBackground
        typedText={typedText}
        subtitle={t("auth:loginSubtitle")}
      />
    </div>
  )
}

export default Login
