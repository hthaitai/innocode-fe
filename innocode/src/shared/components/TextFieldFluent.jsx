import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { EASING } from "./ui/easing"

const TextFieldFluent = ({
  label,
  name,
  value = "",
  onChange,
  onKeyDown,
  placeholder,
  type = "text",
  multiline = false,
  rows = 3,
  error = false,
  helperText = "",
  disabled = false,
  maxLength = null, // null means no limit, or can be set per
  startIcon = null, // optional icon at the start
  endButton = null, // optional button inside input at the end
}) => {
  const [focused, setFocused] = useState(false)

  const handleFocus = () => setFocused(true)
  const handleBlur = () => setFocused(false)

  // Default maxLength: 200 for single-line inputs, no limit for multiline unless specified
  const effectiveMaxLength =
    maxLength !== null ? maxLength : multiline ? null : 200

  const handleChange = (e) => {
    const newValue = e.target.value
    if (effectiveMaxLength === null || newValue.length <= effectiveMaxLength) {
      onChange(e) // only call parent if within limit (or no limit)
    }
  }

  return (
    <div className="flex flex-col w-full">
      {label && (
        <div className="text-xs leading-4 mb-2 capitalize">{label}</div>
      )}

      <div
        className={`flex items-center rounded-[5px] bg-white border transition-all duration-200
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-text"}
          ${
            error
              ? "border-[#D32F2F]"
              : focused
              ? "border-[#ECECEC] border-b-[#E05307]"
              : "border-[#ECECEC] border-b-[#D3D3D3]"
          }
        `}
      >
        {startIcon && <div className="pl-2">{startIcon}</div>}

        {multiline ? (
          <textarea
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            rows={rows}
            onKeyDown={onKeyDown}
            disabled={disabled}
            className="w-full text-sm leading-5 px-3 py-[5px] rounded-[5px] resize-none outline-none bg-transparent"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            disabled={disabled}
            className="w-full text-sm leading-5 px-3 py-[5px] rounded-[5px] outline-none bg-transparent"
          />
        )}

        {endButton && <div className="pr-1">{endButton}</div>}
      </div>

      {/* live character count */}
      {multiline && effectiveMaxLength !== null && (
        <div
          className={`text-xs mt-1 ${
            value.length > effectiveMaxLength ? "text-red-500" : "text-gray-500"
          }`}
        >
          {value.length}/{effectiveMaxLength}
        </div>
      )}

      <AnimatePresence>
        {helperText && (
          <motion.div
            key="helper-text"
            initial={{ opacity: 0, y: -4 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.2, ease: EASING.fluentOut },
            }}
            exit={{
              opacity: 0,
              y: -4,
              transition: { duration: 0.15, ease: EASING.fluentOut },
            }}
            className={`text-xs leading-4 mt-1 ${
              error ? "text-[#D32F2F]" : "text-[#7A7574]"
            }`}
          >
            {helperText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TextFieldFluent
