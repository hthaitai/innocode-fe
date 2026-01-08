import { AlertTriangle } from "lucide-react"
import React from "react"

export function WarningState({ message }) {
  return (
    <div className="flex items-center gap-5 border border-yellow-400 bg-yellow-100 text-yellow-800 rounded-[5px] px-5 min-h-[70px] text-sm leading-5">
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}
