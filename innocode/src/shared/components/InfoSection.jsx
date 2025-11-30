import React from "react"
import { Info } from "lucide-react"

const InfoSection = ({ title, onEdit, actionText = "Edit", children }) => {
  return (
    <div className="text-sm leading-5 border border-[#E5E5E5] rounded-[5px] bg-white">
      {/* Header */}
      <div className="flex justify-between items-center px-5 min-h-[70px] border-b border-[#E5E5E5]">
        <div className="flex items-center gap-5">
          <Info size={20} />
          <p>{title}</p>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="button-orange"
          >
            {actionText}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="pl-[60px] px-5 py-4 min-h-[70px]">{children}</div>
    </div>
  )
}

export default InfoSection
