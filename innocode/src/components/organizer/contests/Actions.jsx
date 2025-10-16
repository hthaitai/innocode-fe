import React, { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Actions = ({ row, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown if clicked outside
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

  const handleEdit = (e) => {
    e.stopPropagation()
    setOpen(false)
    if (onEdit) onEdit(row)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    setOpen(false)
    if (onDelete) onDelete(row)
  }

  const handleViewDetails = (e) => {
    e.stopPropagation()
    setOpen(false)
    navigate(`/organizer/contests/${row.contest_id}`) // ✅ navigate to detail page
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
        className="p-1 rounded hover:bg-[#F2F2F2]"
      >
        <MoreHorizontal className="w-5 h-5 text-gray-600 cursor-pointer" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="absolute right-0 z-50 mt-2 w-[272px] border border-[#E5E5E5] bg-white rounded-[5px] shadow-lg space-y-1 p-1"
            style={{
              top:
                buttonRef.current?.getBoundingClientRect().bottom +
                window.scrollY,
              left:
                buttonRef.current?.getBoundingClientRect().right -
                272 + // dropdown width
                window.scrollX,
            }}
          >
            <button
              onClick={handleViewDetails}
              className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm hover:bg-[#F0F0F0] rounded-[5px] cursor-pointer"
            >
              <Eye className="w-4 h-4 text-gray-500" /> View Details
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm hover:bg-[#F0F0F0] rounded-[5px] cursor-pointer"
            >
              <Pencil className="w-4 h-4 text-gray-500" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm text-red-500 hover:bg-[#F0F0F0] rounded-[5px] cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-red-500" /> Delete
            </button>
          </div>,
          document.body
        )}
    </>
  )
}

export default Actions
