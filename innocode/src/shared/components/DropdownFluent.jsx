// components/DropdownFluent.jsx
import React, { useState, useRef, useEffect } from "react"
import ReactDOM from "react-dom"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const DropdownFluent = ({
  label,
  options = [],
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 })

  // Close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Calculate menu position
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      setMenuPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [isOpen])

  const handleSelect = (option) => {
    onChange?.(option)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <div className="text-xs leading-4 mb-2 text-[#7A7574] capitalize">
          {label}
        </div>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm leading-5 flex justify-between items-center cursor-pointer border rounded-[5px] px-3 py-2 bg-white transition-all duration-200 border-[#ECECEC] border-b-[#D3D3D3]"
      >
        <span className="capitalize">
          {options.find((opt) => opt.value === value)?.label ||
            placeholder ||
            "Select..."}
        </span>

        <ChevronDown
          size={18}
          className={`text-[#7A7574] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {ReactDOM.createPortal(
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
              style={{
                position: "absolute",
                top: menuPos.top,
                left: menuPos.left,
                width: menuPos.width,
                zIndex: 50,
              }}
              className="bg-white border border-[#E5E5E5] rounded-[5px] shadow-lg overflow-y-auto max-h-[250px]"
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`flex items-center gap-2 text-sm leading-5 px-3 py-2 m-1 rounded-[5px] cursor-pointer transition-colors
                    ${
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
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

export default DropdownFluent
