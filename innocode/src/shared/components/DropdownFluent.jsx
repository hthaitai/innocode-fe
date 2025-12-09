import React, { useState, useRef, useEffect, useMemo, useCallback } from "react"
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

  // Memoize selected option label to prevent unnecessary recalculations
  const selectedLabel = useMemo(() => {
    return options.find((opt) => opt.value === value)?.label || placeholder || "Select..."
  }, [options, value, placeholder])

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return
    
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen])

  // Scroll active item into view when dropdown opens
  useEffect(() => {
    if (isOpen && value !== undefined && itemRefs.current[value]) {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        itemRefs.current[value]?.scrollIntoView({ 
          block: "nearest",
          behavior: "smooth"
        })
      })
    }
  }, [isOpen, value])

  const handleSelect = useCallback((val) => {
    onChange?.(val)
    setIsOpen(false)
  }, [onChange])

  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev)
    }
  }, [disabled])

  const borderClass = error ? "border-[#D32F2F]" : "border-[#ECECEC]"

  return (
    <div className="flex flex-col w-full relative" ref={dropdownRef}>
      {label && (
        <div className="text-xs leading-4 mb-2 capitalize">{label}</div>
      )}

      <div
        onClick={toggleDropdown}
        className={`text-sm leading-5 flex gap-3 justify-between items-center cursor-pointer border rounded-[5px] px-3 min-h-[40px] bg-white transition-colors duration-150 ${borderClass} ${
          disabled ? "opacity-60 cursor-not-allowed" : isOpen ? "border-[#7A7574]" : ""
        }`}
      >
        <span className="capitalize text-[#333] truncate">
          {selectedLabel}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#7A7574] transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Animate helper text */}
      <AnimatePresence>
        {helperText && (
          <motion.div
            key="helper-text"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className={`text-xs mt-1 overflow-hidden ${
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
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 4,
              scale: 1,
              transition: { 
                duration: 0.2, 
                ease: [0.16, 1, 0.3, 1] 
              },
            }}
            exit={{
              opacity: 0,
              y: -4,
              scale: 0.95,
              transition: { duration: 0.15, ease: "easeInOut" },
            }}
            className="absolute left-0 top-full mt-1 bg-white border border-[#E5E5E5] rounded-[5px] shadow-lg overflow-hidden w-full z-50"
            style={{ maxHeight: "200px" }}
          >
            <div className="overflow-y-auto max-h-[200px] overscroll-contain">
              {options.length === 0 ? (
                <div className="px-3 py-2 text-sm text-[#7A7574] text-center">
                  No options available
                </div>
              ) : (
                options.map((option) => (
                  <div
                    key={option.value}
                    ref={(el) => {
                      if (el) itemRefs.current[option.value] = el
                    }}
                    onClick={() => handleSelect(option.value)}
                    className={`flex items-center gap-2 text-sm leading-5 px-3 py-2.5 cursor-pointer transition-colors duration-100 ${
                      value === option.value 
                        ? "bg-[#F5F5F5] text-[#333] font-medium" 
                        : "hover:bg-[#F9F9F9] text-[#333]"
                    }`}
                  >
                    {option.icon && (
                      <span className="text-[#7A7574] flex-shrink-0">{option.icon}</span>
                    )}
                    <span className="truncate">{option.label}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DropdownFluent
