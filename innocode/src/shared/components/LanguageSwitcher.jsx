import React, { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify/react"
import { AnimatePresence, motion } from "framer-motion"
import { EASING } from "./ui/easing"

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const languages = [
    { code: "en", name: "English", icon: "flag:us-4x3" },
    { code: "vi", name: "Tiếng Việt", icon: "flag:vn-4x3" },
  ]

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0]

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-sm leading-5 flex gap-2 items-center justify-center cursor-pointer border rounded-[5px] px-3 min-h-[32px] min-w-[130px] w-max bg-white transition-colors duration-150 ${
          isOpen
            ? "border-[#ECECEC] border-b-[#D3D3D3]"
            : "border-[#ECECEC] border-b-[#D3D3D3]"
        }`}
        aria-label="Change language"
      >
        <Icon icon={currentLanguage.icon} width="20" />
        <span className="hidden sm:inline truncate">
          {currentLanguage.name}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { duration: 0.5, ease: EASING.fluentOut },
            }}
            exit={{
              y: -10,
              opacity: 0,
              transition: { duration: 0.25, ease: EASING.fluentOut },
            }}
            className="absolute right-0 w-40 bg-white border border-[#E5E5E5] rounded-[5px] shadow-lg overflow-hidden mt-2 z-150"
          >
            <div className="flex flex-col gap-1 p-1">
              {languages.map((lang) => {
                const isSelected = i18n.language === lang.code
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center gap-2 text-sm leading-5 py-1.5 px-3 cursor-pointer transition-colors duration-100 rounded-[5px] relative w-full text-left ${
                      isSelected ? "bg-[#F0F0F0]" : "hover:bg-[#F0F0F0]"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] bg-[#E05307] rounded-[5px]"></span>
                    )}

                    <Icon
                      icon={lang.icon}
                      width="20"
                      className="flex-shrink-0"
                    />
                    <span className="truncate">{lang.name}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageSwitcher
