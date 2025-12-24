import React, { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify/react"

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const languages = [
    { code: "en", name: "English", icon: 'flag:us-4x3'  },
    { code: "vi", name: "Tiếng Việt",  icon: "flag:vn-4x3" },
  ]

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0]

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
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
        aria-label="Change language"
      >
        <Icon icon={currentLanguage.icon} width="20" />
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <Icon
          icon="mdi:chevron-down"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          width="16"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                i18n.language === lang.code ? "bg-orange-50 text-orange-600" : "text-gray-700"
              }`}
            >
              <Icon icon={lang.icon} width="20" />

              <span>{lang.name}</span>
              {i18n.language === lang.code && (
                <Icon icon="mdi:check" className="ml-auto" width="16" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher

