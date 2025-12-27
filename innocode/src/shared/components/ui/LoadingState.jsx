import React from "react"
import { Spinner } from "../SpinnerFluent"

export function LoadingState() {
  return (
    <div className={`flex items-center justify-center min-h-[70px]`}>
      <Spinner />
    </div>
  )
}
