import { X } from "lucide-react"
import React, { useEffect } from "react"

const MODAL_SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  full: "max-w-5xl",
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  footer,
  size = "lg",
  children,
}) {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [onClose])

  if (!isOpen) return null

  const modalSizeClass = MODAL_SIZES[size] || MODAL_SIZES.md

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-[5px] shadow-lg relative w-full ${modalSizeClass} max-h-[80vh] overflow-y-auto flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-[#F3F3F3] px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#C42B1C] hover:text-white rounded transition"
          >
            <X size={20} strokeWidth={1} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-6 flex justify-end gap-2 bg-[#F3F3F3]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
