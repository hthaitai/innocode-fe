import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"

const AboutHero = () => {
  const { t } = useTranslation("about")
  const textToType = t("hero.title2")
  const [typedText, setTypedText] = useState("")

  useEffect(() => {
    let timeout
    const animateTyping = (index) => {
      if (index <= textToType.length) {
        setTypedText(textToType.slice(0, index))
        timeout = setTimeout(() => animateTyping(index + 1), 100)
      }
    }

    setTypedText("")
    timeout = setTimeout(() => animateTyping(0), 500) // Slight delay start

    return () => clearTimeout(timeout)
  }, [textToType])

  return (
    <div className="border-b border-gray-300 relative overflow-hidden bg-white">
      {/* Decorative Blob - Static */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-gradient-to-br from-orange-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <h1 className="text-display font-bold text-gray-900 mb-6 tracking-tight">
          {t("hero.title1")} <br className="hidden md:block" />
          <span className="text-[#E05307] inline-block">
            {typedText}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-[3px] h-[0.8em] bg-[#E05307] ml-1 align-baseline mb-[-0.05em]"
            />
          </span>
        </h1>
        <p className="text-subtitle-1 text-gray-600 leading-relaxed max-w-2xl">
          {t("hero.description")}
        </p>
      </div>
    </div>
  )
}

export default AboutHero
