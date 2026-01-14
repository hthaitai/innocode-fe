import React, { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { EASING } from "./ui/easing"
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation("common")
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const itemRefs = useRef({}) // refs for each item
  const [dropdownPosition, setDropdownPosition] = useState({
    top: "100%",
    left: 0,
  })
  const [dropdownDirection, setDropdownDirection] = useState({
    vertical: "down", // or "up"
    horizontal: "right", // or "left"
  })

  // Memoize selected option label to prevent unnecessary recalculations
  const selectedLabel = useMemo(() => {
    return (
      options.find((opt) => opt.value === value)?.label ||
      placeholder ||
      t("common.selectPlaceholder")
    )
  }, [options, value, placeholder, t])

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
          behavior: "smooth",
        })
      })
    }
  }, [isOpen, value])

  useEffect(() => {
    if (!isOpen) return

    const calculatePosition = () => {
      if (!dropdownRef.current) return

      const rect = dropdownRef.current.getBoundingClientRect()
      const dropdownHeight = 200 // your max height
      const dropdownWidth = 364 // your max width

      // Simple flip if touching edges
      const vertical =
        rect.bottom + dropdownHeight > window.innerHeight ? "up" : "down"
      const horizontal =
        rect.left + dropdownWidth > window.innerWidth ? "left" : "right"

      setDropdownDirection({ vertical, horizontal })

      // Set CSS position
      const position = {
        top: vertical === "down" ? "100%" : "auto",
        bottom: vertical === "up" ? "100%" : "auto",
        left: horizontal === "right" ? 0 : "auto",
        right: horizontal === "left" ? 0 : "auto",
      }

      setDropdownPosition(position)
    }

    calculatePosition()
    window.addEventListener("resize", calculatePosition)
    window.addEventListener("scroll", calculatePosition, true)

    return () => {
      window.removeEventListener("resize", calculatePosition)
      window.removeEventListener("scroll", calculatePosition, true)
    }
  }, [isOpen])

  const handleSelect = useCallback(
    (val) => {
      onChange?.(val)
      setIsOpen(false)
    },
    [onChange]
  )

  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }, [disabled])

  const borderClass = error ? "border-[#D32F2F]" : "border-[#ECECEC]"

  return (
    <div className="flex flex-col w-full">
      {label && (
        <div className="text-xs leading-4 mb-2 capitalize">{label}</div>
      )}

      <div className="relative w-full" ref={dropdownRef}>
        <div
          onClick={toggleDropdown}
          className={`text-sm leading-5 flex gap-3 justify-between items-center cursor-pointer border border-b-[#D3D3D3] rounded-[5px] px-3 min-h-[32px] bg-white transition-colors duration-150 ${borderClass} ${
            disabled
              ? "opacity-60 cursor-not-allowed"
              : isOpen
              ? "border-[#7A7574]"
              : ""
          }`}
          title={selectedLabel}
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown
            size={16}
            className={`text-[#7A7574] transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown menu - Moved inside the relative container */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="dropdown"
              initial={{ y: -20, opacity: 0 }} // start slightly above
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
              className="absolute left-0 top-full bg-white border border-[#E5E5E5] rounded-[5px] shadow-lg overflow-hidden w-full z-[9999]"
              style={{
                maxHeight: "400px",
                width: "max-content",
                maxWidth: "364px",
                minWidth: dropdownRef.current?.offsetWidth,
                ...dropdownPosition, // apply calculated position
              }}
            >
              <div className="overflow-y-auto max-h-[400px] overscroll-contain p-1 flex flex-col gap-1">
                {options.length === 0 ? (
                  <div className="py-1.5 px-3 text-sm leading-5 text-[#7A7574] text-center">
                    {t("common.noOptionsAvailable")}
                  </div>
                ) : (
                  options.map((option) => (
                    <div
                      key={option.value}
                      ref={(el) => {
                        if (el) itemRefs.current[option.value] = el
                      }}
                      onClick={() => handleSelect(option.value)}
                      className={`flex items-start gap-2 text-sm leading-5 py-1.5 px-3 cursor-pointer transition-colors duration-100 rounded-[5px] relative ${
                        value === option.value
                          ? "bg-[#F0F0F0]"
                          : "hover:bg-[#F0F0F0]"
                      }`}
                      title={option.label}
                    >
                      {value === option.value && (
                        <span className="absolute left-0 top-2.5 h-3 w-[3px] bg-[#E05307] rounded-[5px]"></span>
                      )}

                      {option.icon && (
                        <span className="text-[#7A7574] flex-shrink-0 mt-0.5">
                          {option.icon}
                        </span>
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

      {helperText && (
        <div
          className={`text-xs mt-1 ${
            error ? "text-[#D32F2F]" : "text-[#7A7574]"
          }`}
        >
          {helperText}
        </div>
      )}
    </div>
  )
}

export default DropdownFluent
