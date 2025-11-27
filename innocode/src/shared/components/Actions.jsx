import { MoreHorizontal } from "lucide-react"
import React, { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"

const Actions = ({ row, items = [] }) => {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // --- Calculate dropdown position
  const updatePosition = () => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    setPosition({
      top: rect.bottom + window.scrollY + 4, // small offset
      left: rect.right + window.scrollX - 272, // dropdown width = 272
    })
  }

  // --- Recalculate on open, scroll, or resize
  useEffect(() => {
    if (open) {
      updatePosition()
      window.addEventListener("scroll", updatePosition, true)
      window.addEventListener("resize", updatePosition)
    }
    return () => {
      window.removeEventListener("scroll", updatePosition, true)
      window.removeEventListener("resize", updatePosition)
    }
  }, [open])

  // --- Close when clicking outside
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

  // --- Handle menu item click
  const handleItemClick = (e, item) => {
    e.stopPropagation()
    setOpen(false)
    item.onClick?.(row)
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        className="flex items-center justify-end h-full w-full"
      >
        <MoreHorizontal className="w-5 h-5 cursor-pointer text-[#7A7574] hover:text-black transition-colors" />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="actions-menu"
              ref={menuRef}
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
                top: position.top,
                left: position.left,
                width: 200,
                zIndex: 50,
              }}
              className="min-w-[272px] bg-white border border-[#E5E5E5] rounded-[5px] shadow-xl overflow-hidden p-1"
            >
              {items.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={index}
                    onClick={(e) => handleItemClick(e, item)}
                    className={`cursor-pointer flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded-[5px] transition-colors
                      hover:bg-[#F0F0F0] active:bg-[#F3F3F3] ${
                        item.className || ""
                      }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.label}
                  </motion.button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}

export default Actions
