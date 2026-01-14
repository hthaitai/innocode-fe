import React from "react"
import { useTranslation } from "react-i18next"
import { Scale } from "lucide-react"
import { useModal } from "@/shared/hooks/useModal"

const AppealActions = ({ appeal }) => {
  const { t } = useTranslation(["appeal"])
  const { openModal } = useModal()

  const handleReviewModal = () => {
    openModal("reviewAppeal", { appeal })
  }

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 gap-5 flex justify-between items-center min-h-[70px] hover:bg-[#F6F6F6] transition-colors">
      <div className="flex items-center gap-5">
        <Scale size={20} />
        <div className="flex flex-col justify-center">
          <p className="text-[14px] leading-[20px]">{t("reviewAppealTitle")}</p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            {t("reviewAppealDescription")}
          </p>
        </div>
      </div>

      <button className="button-orange" onClick={handleReviewModal}>
        {t("review")}
      </button>
    </div>
  )
}

export default AppealActions
