import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

export const FullScreenLoader = () => {
  const { t } = useTranslation(["loader"])
  const [typedText, setTypedText] = useState("")
  const fullText = t("loadingText", "Loading resources...")

  useEffect(() => {
    let timeout
    const animateTyping = (index) => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        timeout = setTimeout(() => animateTyping(index + 1), 100)
      } else {
        timeout = setTimeout(() => animateTyping(0), 2000) // Wait 2s then restart
      }
    }

    // Reset typed text when language changes to avoid weird partial states
    setTypedText("")
    timeout = setTimeout(() => animateTyping(0), 100)

    return () => clearTimeout(timeout)
  }, [fullText])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFAFA]">
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Outer rotating ring */}
        <motion.div
          className="absolute w-24 h-24 rounded-full border-4 border-t-[#ff6b35] border-r-[#ff6b35]/30 border-b-[#ff6b35]/10 border-l-[#ff6b35]/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner pulsing circle */}
        <motion.div
          className="w-16 h-16 bg-gradient-to-tr from-[#ff6b35] to-[#f7931e] rounded-full shadow-lg flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="w-8 h-8 bg-white/20 rounded-full blur-sm"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Text Container */}
      <motion.div
        className="mt-10 text-center space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff6b35] to-[#f7931e]">
          Innocode
        </h2>
        <div className="flex items-center gap-1 justify-center text-[#7A7574] text-sm font-medium h-[20px]">
          <span>{typedText}</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-[2px] h-[14px] bg-[#7A7574] ml-0.5 align-middle"
          />
        </div>
      </motion.div>
    </div>
  )
}
