import React from "react"
import { Spinner } from "../SpinnerFluent"

export const StatusMessage = ({ isLoading, error, dataLength }) => {
  if (isLoading)
    return (
      <div className="min-h-[70px] flex items-center justify-center">
        <Spinner />
      </div>
    )

  if (error)
    return (
      <div className="text-red-600 text-xs leading-4 border border-red-300 rounded-[5px] bg-red-50 px-5 flex justify-center items-center min-h-[70px]">
        <p>Failed to load templates.</p>
      </div>
    )
    
  if (dataLength === 0)
    return (
      <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
        <p>No templates uploaded yet.</p>
      </div>
    )

  return null // Nothing to show if data is available
}
