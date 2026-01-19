import React from "react"
import { useTranslation } from "react-i18next"
import { ArrowRightLeft } from "lucide-react"
import { useModal } from "@/shared/hooks/useModal"

const TransferSubmissionsSection = ({ contestId, roundId }) => {
  const { t } = useTranslation("round")
  const { openModal } = useModal()

  const handleOpenModal = () => {
    openModal("transferSubmissions", {
      contestId,
      roundId,
    })
  }

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <ArrowRightLeft size={20} />
        <span className="text-sm">{t("transfer.title")}</span>
      </div>
      <button className="button-orange" onClick={handleOpenModal}>
        {t("transfer.transferButton")}
      </button>
    </div>
  )
}

export default TransferSubmissionsSection
