import React, { useCallback } from "react"
import { Icon } from "@iconify/react"
import { useModal } from "@/shared/hooks/useModal"

const RoundOpenCodeSection = ({ roundId }) => {
  const { openModal } = useModal()

  const handleOpen = useCallback(() => {
    openModal("organizerOpenCode", { roundId })
  }, [openModal, roundId])

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Icon icon="mdi:code-braces-box" fontSize={20} />
        <div>
          <p className="text-[14px] leading-[20px]">Open code</p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            View, generate, and manage the open code for this round
          </p>
        </div>
      </div>
      <button onClick={handleOpen} className="button-orange px-3">
        Manage
      </button>
    </div>
  )
}

export default RoundOpenCodeSection
