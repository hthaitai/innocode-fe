import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react"
import { AnimatePresence, motion } from "framer-motion"
import { AnimatedSection } from "../ui/AnimatedSection"

const BreadcrumbTitle = ({ items = [], paths = [], maxVisible = 3 }) => {
  const navigate = useNavigate()
  const [showAll, setShowAll] = useState(false)
  const fluentEaseOut = [0.16, 1, 0.3, 1]

  if (!items || items.length === 0) return null

  const handleBreadcrumbClick = (index) => {
    if (index === items.length - 1) return // Last item = current page
    if (paths && paths[index]) navigate(paths[index])
    else navigate(-1)
  }

  const isCollapsible = items.length > maxVisible

  let firstItems = []
  let lastItems = []
  let hiddenItems = []

  if (isCollapsible) {
    firstItems = [items[0]] // Always show first
    lastItems = items.slice(items.length - (maxVisible - 1))
    hiddenItems = items.slice(1, items.length - (maxVisible - 1))
  } else {
    firstItems = items
    lastItems = []
    hiddenItems = []
  }

  return (
    <div className="flex items-center gap-2 text-[28px] leading-[36px] font-semibold flex-wrap min-w-0 max-w-full">
      {/* First visible items */}
      {firstItems.map((item, index) => (
        <React.Fragment key={`first-${index}`}>
          {index !== 0 && (
            <Icon
              icon="mdi:chevron-right"
              className="h-6 w-6 text-[#7A7574] flex-shrink-0"
            />
          )}
          <span
            className={`${
              index === items.length - 1
                ? "text-black cursor-default"
                : "text-[#7A7574] cursor-pointer hover:text-orange-500 transition-colors duration-200"
            } truncate max-w-[400px]`}
            onClick={() => handleBreadcrumbClick(index)}
            title={item}
          >
            {item}
          </span>

          {/* Ellipsis dropdown if collapsible */}
          {isCollapsible && hiddenItems.length > 0 && index === 0 && (
            <>
              <Icon
                icon="mdi:chevron-right"
                className="h-6 w-6 text-[#7A7574]"
              />
              <span
                className="text-[#7A7574] cursor-pointer hover:text-orange-500 relative transition-colors duration-200"
                onClick={() => setShowAll(!showAll)}
              >
                ...
                <AnimatePresence>
                  {showAll && (
                    <AnimatedSection direction="top">
                      <div className="p-1 absolute top-full left-0 mt-3 bg-white border border-[#E5E5E5] shadow-lg rounded-[5px] overflow-hidden min-w-max z-50 flex flex-col gap-1">
                        {hiddenItems.map((hiddenItem, i) => (
                          <span
                            key={`hidden-${i}`}
                            className="rounded-[5px] px-3 py-1.5 cursor-pointer text-sm leading-5 text-black hover:bg-[#F0F0F0] transition-colors duration-150"
                            onClick={() => handleBreadcrumbClick(i + 1)}
                          >
                            {hiddenItem}
                          </span>
                        ))}
                      </div>
                    </AnimatedSection>
                  )}
                </AnimatePresence>
              </span>
            </>
          )}
        </React.Fragment>
      ))}

      {/* Last visible items */}
      {lastItems.map((item, index) => {
        const realIndex = items.length - lastItems.length + index
        return (
          <React.Fragment key={`last-${realIndex}`}>
            {firstItems.length > 0 || index !== 0 ? (
              <Icon
                icon="mdi:chevron-right"
                className="h-6 w-6 text-[#7A7574] flex-shrink-0"
              />
            ) : null}
            <span
              className={`${
                realIndex === items.length - 1
                  ? "text-black cursor-default"
                  : "text-[#7A7574] cursor-pointer hover:text-orange-500 transition-colors duration-200"
              } truncate max-w-[400px]`}
              onClick={() => handleBreadcrumbClick(realIndex)}
              title={item}
            >
              {item}
            </span>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default BreadcrumbTitle
