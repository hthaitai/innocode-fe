import React from "react"

export function ErrorState({ itemName }) {
  return (
    <div
      className={`text-red-600 text-sm leading-5 border border-red-200 rounded-[5px] bg-red-50 flex items-center justify-center px-5 min-h-[70px]`}
    >
      <p className="text-xs leading-4">
        {itemName
          ? `Failed to load ${itemName}. Please try again.`
          : "Something went wrong. Please try again."}
      </p>
    </div>
  )
}
