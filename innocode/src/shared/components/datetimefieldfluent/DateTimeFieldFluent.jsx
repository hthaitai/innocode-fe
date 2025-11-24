import React, { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import dayjs from "dayjs"
import CalendarPicker from "./CalendarPicker"
import TimeDropdown from "./TimeDropdown"

const DateTimeFieldFluent = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
}) => {
  const [focused, setFocused] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(value ? dayjs(value) : null)
  const containerRef = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowPicker(false)
        setFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Wrap setSelectedDate to immediately trigger onChange
  const handleDateChange = (date) => {
    setSelectedDate(date)
    if (date) {
      onChange({
        target: { name, value: date.format("YYYY-MM-DDTHH:mm") },
      })
    }
  }

  return (
    <div className="flex flex-col w-full relative" ref={containerRef}>
      {label && (
        <div className="text-xs leading-4 mb-2 capitalize">{label}</div>
      )}

      <div
        className={`inline-flex items-center justify-between gap-3 rounded-[5px] bg-white transition-all duration-200 px-3 min-h-[32px] ${
          error
            ? "border border-[#D32F2F]"
            : focused
            ? "border border-[#ECECEC] border-b-[#E05307]"
            : "border border-[#ECECEC] border-b-[#D3D3D3]"
        } cursor-pointer w-max`}
        onClick={() => setShowPicker((prev) => !prev)} // <-- toggle instead of always true
      >
        <span className="text-sm text-gray-700">
          {selectedDate
            ? selectedDate.format("DD/MM/YYYY hh:mm A")
            : "Select date and time"}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 ${
            showPicker ? "rotate-180" : ""
          }`}
        />
      </div>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            key="picker"
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
            className="absolute top-full bg-white border border-[#E5E5E5] rounded-[5px] shadow-lg p-5 z-50"
          >
            <div className="flex gap-5">
              <CalendarPicker
                selectedDate={selectedDate}
                setSelectedDate={handleDateChange} // <-- use wrapped handler
              />
              <TimeDropdown
                selectedDate={selectedDate}
                setSelectedDate={handleDateChange} // <-- use wrapped handler
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {helperText && (
        <AnimatePresence>
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
        </AnimatePresence>
      )}
    </div>
  )
}

export default DateTimeFieldFluent
