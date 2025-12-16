import React, { useState, useEffect, useRef } from "react"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

const TemplateActions = ({ template, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  // Close on scroll
  useEffect(() => {
    if (!open) return

    const handleScroll = () => setOpen(false)
    window.addEventListener("scroll", handleScroll, true)

    return () => window.removeEventListener("scroll", handleScroll, true)
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      {/* Toggle button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        className="p-1 rounded hover:bg-gray-100"
      >
        <MoreHorizontal
          size={18}
          className="cursor-pointer text-[#7A7574] hover:text-black transition-colors"
        />
      </button>

      {/* Dropdown menu with exact Actions styling */}
      <AnimatePresence>
        {open && (
          <motion.div
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
            className="absolute right-0 mt-1 min-w-[272px] bg-white border border-[#E5E5E5] rounded-[5px] shadow-xl overflow-hidden p-1 z-10"
          >
            <button
              onClick={() => {
                setOpen(false)
                onEdit(template)
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded-[5px] transition-colors hover:bg-[#F0F0F0] active:bg-[#F3F3F3]"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>

            <button
              onClick={() => {
                setOpen(false)
                onDelete(template)
              }}
              className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded-[5px] transition-colors hover:bg-[#F0F0F0] active:bg-[#F3F3F3] text-red-500"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TemplateActions
