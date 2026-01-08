import { Info, X } from "lucide-react"
import React from "react"

export function NotificationState({ message, onClose }) {
  return (
    <div className="flex items-center justify-between gap-5 border border-orange-400 bg-orange-50 text-orange-800 rounded-[5px] px-5 min-h-[70px] text-sm leading-5">
      <div className="flex items-center gap-5">
        <Info className="w-5 h-5 flex-shrink-0" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-orange-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
