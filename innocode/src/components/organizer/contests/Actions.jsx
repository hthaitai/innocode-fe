import React, { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"

/**
 * Generalized Actions Dropdown Component
 *
 * Props:
 * - row: The data row associated with the dropdown
 * - items: Array of menu items [{ label, icon?, onClick, className? }]
 */
const Actions = ({ row, items = [] }) => {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle item click and stop event from bubbling
  const handleItemClick = (e, item) => {
    e.stopPropagation() // Prevent row click
    setOpen(false)
    item.onClick?.(row)
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation() // Stop row click for dropdown toggle
          setOpen((prev) => !prev)
        }}
        className="p-1 rounded hover:bg-[#F2F2F2]"
      >
        <span className="w-5 h-5 text-gray-600 cursor-pointer">⋮</span>
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="absolute z-50 mt-2 w-[200px] border border-[#E5E5E5] bg-white rounded-[5px] shadow-lg space-y-1 p-1"
            style={{
              top:
                buttonRef.current?.getBoundingClientRect().bottom +
                window.scrollY,
              left:
                buttonRef.current?.getBoundingClientRect().right -
                200 + // dropdown width
                window.scrollX,
            }}
          >
            {items.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  onClick={(e) => handleItemClick(e, item)}
                  className={`flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm hover:bg-[#F0F0F0] rounded-[5px] ${
                    item.className || ""
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.label}
                </button>
              )
            })}
          </div>,
          document.body
        )}
    </>
  )
}

export default Actions
