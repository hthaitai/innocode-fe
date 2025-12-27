import React from "react"

export function MissingState({ itemName }) {
  return (
    <div
      className={`text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]`}
    >
      {itemName
        ? `This ${itemName} is currently unavailable or deleted.`
        : "This item is currently unavailable or deleted."}
    </div>
  )
}
