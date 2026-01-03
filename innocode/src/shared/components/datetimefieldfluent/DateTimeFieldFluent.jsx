import React, { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import dayjs from "dayjs"
import CalendarPicker from "./CalendarPicker"
import TimeDropdown from "./TimeDropdown"
import { EASING } from "../ui/easing"

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
  const [initialDate, setInitialDate] = useState(null) // Store initial date when picker opens
  const containerRef = useRef()
  const pickerRef = useRef(null)

  const [pickerPosition, setPickerPosition] = useState({
    top: "100%",
    left: 0,
  })

  // Sync selectedDate with value prop when it changes externally (only when picker is closed)
  useEffect(() => {
    if (!showPicker) {
      if (value) {
        const dateValue = dayjs(value)
        setSelectedDate(dateValue)
        setInitialDate(dateValue)
      } else {
        setSelectedDate(null)
        setInitialDate(null)
      }
    }
  }, [value, showPicker])

  // When picker opens, save the current value as initial (snapshot)
  useEffect(() => {
    if (showPicker) {
      // Save current selectedDate as initial when opening picker
      setInitialDate(selectedDate)
    }
  }, [showPicker]) // Only when showPicker changes to true

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        // Reset to initial value when clicking outside
        setSelectedDate(initialDate)
        setShowPicker(false)
        setFocused(false)
      }
    }
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showPicker, initialDate])

  useEffect(() => {
    if (!showPicker) return

    const calculatePosition = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      // Estimate picker dimensions if not yet rendered, or use ref if available
      // Using generic max dimensions or actual if available
      const pickerHeight = pickerRef.current?.offsetHeight || 300
      const pickerWidth = pickerRef.current?.offsetWidth || 420

      // Simple flip if touching edges
      const vertical =
        rect.bottom + pickerHeight > window.innerHeight ? "up" : "down"
      const horizontal =
        rect.left + pickerWidth > window.innerWidth ? "left" : "right"

      // Set CSS position
      const position = {
        top: vertical === "down" ? "100%" : "auto",
        bottom: vertical === "up" ? "100%" : "auto",
        left: horizontal === "right" ? 0 : "auto",
        right: horizontal === "left" ? 0 : "auto",
      }

      setPickerPosition(position)
    }

    // Initial calculation
    calculatePosition()

    // Recalculate on resize and scroll
    window.addEventListener("resize", calculatePosition)
    window.addEventListener("scroll", calculatePosition, true)

    // Also try to recalculate after a short delay to ensure content is rendered
    const rafId = requestAnimationFrame(() => {
      calculatePosition()
    })

    return () => {
      window.removeEventListener("resize", calculatePosition)
      window.removeEventListener("scroll", calculatePosition, true)
      cancelAnimationFrame(rafId)
    }
  }, [showPicker])

  // Handle date change without triggering onChange immediately
  // onChange will be triggered only when Save button is clicked
  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  // Handle save button click
  const handleSave = () => {
    if (selectedDate) {
      onChange({
        target: { name, value: selectedDate.format("YYYY-MM-DDTHH:mm") },
      })
      // Update initialDate to the saved value
      setInitialDate(selectedDate)
    }
    setShowPicker(false)
    setFocused(false)
  }

  // Display the saved value (from value prop) or selectedDate if picker is open
  const displayDate = showPicker ? selectedDate : value ? dayjs(value) : null

  return (
    <div className="flex flex-col w-full relative" ref={containerRef}>
      {label && (
        <div className="text-xs leading-4 mb-2 capitalize">{label}</div>
      )}

      <div className="relative inline-block w-max">
        <div
          className={`inline-flex items-center justify-between gap-3 rounded-[5px] bg-white transition-all duration-200 px-3 min-h-[32px] ${
            error
              ? "border border-[#D32F2F]"
              : focused
              ? "border border-[#ECECEC] border-b-[#E05307]"
              : "border border-[#ECECEC] border-b-[#D3D3D3]"
          } cursor-pointer w-max`}
          onClick={() => {
            const willOpen = !showPicker
            if (willOpen) {
              // When opening, save current value as initial
              const currentValue = value ? dayjs(value) : null
              setInitialDate(currentValue)
              setSelectedDate(currentValue)
            }
            setShowPicker(willOpen)
          }}
        >
          <span className="text-sm text-gray-700">
            {displayDate
              ? displayDate.format("DD/MM/YYYY hh:mm A")
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
              className="min-w-[420px] absolute top-full bg-white border border-[#E5E5E5] rounded-[5px] shadow-lg p-5 z-50"
              style={{
                ...pickerPosition,
              }}
              ref={pickerRef}
            >
              <div className="flex flex-col gap-4">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-fit">
                    <CalendarPicker
                      selectedDate={selectedDate}
                      setSelectedDate={handleDateChange} // <-- use wrapped handler
                    />
                  </div>
                  <TimeDropdown
                    selectedDate={selectedDate}
                    setSelectedDate={handleDateChange} // <-- use wrapped handler
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="button-orange"
                  >
                    Save
                  </button>
                </div>
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

export default DateTimeFieldFluent
