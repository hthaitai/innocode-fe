import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { EASING } from "@/shared/components/ui/easing"

const ExpandableCard = ({
  icon,
  header,
  children,
  className = "",
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div
      className={`border border-[#E5E5E5] rounded-[5px] bg-white overflow-hidden ${className}`}
    >
      {/* Trigger Row */}
      <div
        className="cursor-pointer hover:bg-[#F6F6F6] transition-colors px-5 py-4 min-h-[70px] flex items-center justify-between gap-5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Icon */}
        {icon && <div className="flex-shrink-0">{icon}</div>}

        {/* Header Content */}
        <div className="flex-1 min-w-0">{header}</div>

        {/* Chevron */}
        <ChevronDown
          size={20}
          className={`text-[#7A7574] transition-transform duration-200 flex-shrink-0 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Expandable Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.3, ease: EASING.fluentOut },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.2, ease: EASING.fluentOut },
            }}
            className="overflow-hidden border-t border-[#E5E5E5]"
          >
            <div className="text-sm leading-5 pl-[60px] px-5 py-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ExpandableCard
