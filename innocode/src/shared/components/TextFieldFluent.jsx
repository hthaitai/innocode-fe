import React, { useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"

const TextFieldFluent = ({
  label,
  name,
  value = "",
  onChange,
  placeholder,
  type = "text",
  multiline = false,
  rows = 3,
  error = false,
  helperText = "",
  disabled = false,
}) => {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const handleFocus = () => setFocused(true)
  const handleBlur = () => setFocused(false)

  return (
    <div className="flex flex-col w-full">
      {label && (
        <div className="text-xs leading-4 mb-2 capitalize">
          {label}
        </div>
      )}

      <div
        className={`flex items-start rounded-[5px] bg-white border transition-all duration-200
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-text"}
          ${
            error
              ? "border-[#D32F2F]"
              : focused
              ? "border-[#ECECEC] border-b-[#E05307]"
              : "border-[#ECECEC] border-b-[#D3D3D3]"
          }
        `}
        onClick={() => inputRef.current?.focus()}
      >
        {multiline ? (
          <textarea
            ref={inputRef}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            rows={rows}
            disabled={disabled}
            className="w-full text-sm leading-5 px-3 py-2 rounded-[5px] resize-none outline-none bg-transparent"
          />
        ) : (
          <input
            ref={inputRef}
            type={type}
            name={name}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            className="w-full text-sm leading-5 px-3 py-2 rounded-[5px] outline-none bg-transparent"
          />
        )}
      </div>

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
    </div>
  )
}

export default TextFieldFluent
