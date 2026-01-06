import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Terminal } from "lucide-react"

export default function NotFound() {
  const { t } = useTranslation(["pages", "common"])
  const navigate = useNavigate()
  const [typedText, setTypedText] = useState("")
  const fullText = t("pages:notFound.subtitle", "Innocode")

  // Robust typing effect with loop
  useEffect(() => {
    let timeout
    const animateTyping = (index) => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        timeout = setTimeout(() => animateTyping(index + 1), 150)
      } else {
        // Wait 3 seconds then restart
        timeout = setTimeout(() => animateTyping(0), 3000)
      }
    }
    animateTyping(0)
    return () => clearTimeout(timeout)
  }, [fullText])

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4 bg-white">
      <h1 className="text-7xl font-extrabold mb-4 text-gray-800">
        {t("pages:notFound.title", "404")}
      </h1>

      <p className="text-lg text-gray-500 mb-6">
        {t("pages:notFound.message", "Page not found")}
      </p>

      <div>
        <button onClick={() => navigate("/")} className="button-orange">
          {t("pages:notFound.backToHome", "Back to Home")}
        </button>
      </div>

      <div className="mt-10 text-sm leading-5 flex items-center justify-center gap-2 text-gray-500 font-medium">
        <Terminal className="w-5 h-5 text-gray-500" />
        <span>
          {typedText}
          <span className="animate-pulse">|</span>
        </span>
      </div>
    </div>
  )
}
