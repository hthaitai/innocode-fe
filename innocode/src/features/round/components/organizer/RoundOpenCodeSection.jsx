import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify/react"
import { useModal } from "@/shared/hooks/useModal"

const RoundOpenCodeSection = ({ roundId }) => {
  const { openModal } = useModal()
  const { t } = useTranslation("round")

  const handleOpen = useCallback(() => {
    openModal("organizerOpenCode", { roundId })
  }, [openModal, roundId])

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Icon icon="mdi:code-braces-box" fontSize={20} />
        <div>
          <p className="text-[14px] leading-[20px]">{t("openCode.title")}</p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            {t("openCode.description")}
          </p>
        </div>
      </div>
      <button onClick={handleOpen} className="button-orange px-3">
        {t("openCode.manage")}
      </button>
    </div>
  )
}

export default RoundOpenCodeSection
