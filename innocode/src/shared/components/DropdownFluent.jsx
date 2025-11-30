import React, { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
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
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const dropdownRef = useRef(null)
  const itemRefs = useRef({}) // refs for each item

  // Toggle dropdown & calculate position
  const handleToggle = () => {
    if (disabled) return
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
    setIsOpen(!isOpen)
  }

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !document.getElementById("dropdown-portal")?.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Update dropdown position on scroll
  useEffect(() => {
    if (!isOpen) return
    const handleScroll = () => {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect()
        setCoords({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }
    }
    window.addEventListener("scroll", handleScroll, true)
    return () => window.removeEventListener("scroll", handleScroll, true)
  }, [isOpen])

  // Scroll active item into view when dropdown opens
  useEffect(() => {
    if (isOpen && value !== undefined && itemRefs.current[value]) {
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
        onClick={handleToggle}
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

      {/* Portal Dropdown */}
      {isOpen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              id="dropdown-portal"
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
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                width: coords.width,
                transformOrigin: "top",
                zIndex: 9999,
              }}
              className="bg-white border border-[#E5E5E5] rounded-[5px] shadow-lg overflow-y-auto max-h-[250px]"
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  ref={(el) => (itemRefs.current[option.value] = el)}
                  onClick={() => handleSelect(option.value)}
                  className={`flex items-center gap-2 text-sm leading-5 px-3 py-2 m-1 rounded-[5px] cursor-pointer transition-colors ${
                    value === option.value
                      ? "bg-[#F0F0F0]"
                      : "hover:bg-[#F0F0F0]"
                  }`}
                >
                  {option.icon && (
                    <span className="text-[#7A7574]">{option.icon}</span>
                  )}
                  {option.label}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}

export default DropdownFluent
