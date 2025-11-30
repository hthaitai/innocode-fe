import React, { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const DropdownFluent = ({
  label,
  options = [],
  value,
  onChange,
  placeholder,
  error = false,
  helperText = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const itemRefs = useRef({}) // refs for each item

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Scroll active item into view when dropdown opens
  useEffect(() => {
    if (isOpen && value !== undefined && itemRefs.current[value]) {
      // small delay to ensure animation renders first
      setTimeout(() => {
        itemRefs.current[value].scrollIntoView({ block: "nearest" })
      }, 0)
    }
  }, [isOpen, value])

  const handleSelect = (val) => {
    onChange?.(val)
    setIsOpen(false)
  }

  const borderClass = error ? "border-[#D32F2F]" : "border-[#ECECEC]"

  return (
    <div className="flex flex-col w-full relative" ref={dropdownRef}>
      {label && (
        <div className="text-xs leading-4 mb-2 capitalize">{label}</div>
      )}

      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`text-sm leading-5 flex gap-3 justify-between items-center cursor-pointer border rounded-[5px] px-3 min-h-[32px] min-w-[130px] bg-white transition-all duration-200 ${borderClass} ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        <span className="capitalize text-[#333]">
          {options.find((opt) => opt.value === value)?.label ||
            placeholder ||
            "Select..."}
        </span>
        <ChevronDown
          size={14}
          className={`text-[#7A7574] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Animate helper text */}
      <AnimatePresence>
        {helperText && (
          <motion.div
            key="helper-text"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`text-xs mt-1 ${
              error ? "text-[#D32F2F]" : "text-[#7A7574]"
            }`}
          >
            {helperText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -6, scaleY: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scaleY: 1,
              transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
            }}
            exit={{
              opacity: 0,
              y: -4,
              scaleY: 0.98,
              transition: { duration: 0.2, ease: "easeInOut" },
            }}
            className="absolute left-0 top-full bg-white border border-[#E5E5E5] rounded-[5px] shadow-lg overflow-y-auto max-h-[250px] w-full z-50"
          >
            {options.map((option) => (
              <div
                key={option.value}
                ref={(el) => (itemRefs.current[option.value] = el)} // attach ref
                onClick={() => handleSelect(option.value)}
                className={`flex items-center gap-2 text-sm leading-5 px-3 py-2 m-1 rounded-[5px] cursor-pointer transition-colors ${
                  value === option.value ? "bg-[#F0F0F0]" : "hover:bg-[#F0F0F0]"
                }`}
              >
                {option.icon && (
                  <span className="text-[#7A7574]">{option.icon}</span>
                )}
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DropdownFluent
