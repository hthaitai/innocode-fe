import React from "react"
import { Info } from "lucide-react"
import { useTranslation } from "react-i18next"

const InfoSection = ({ title, onEdit, actionText, children }) => {
  const { t } = useTranslation("common")
  const buttonText = actionText || t("buttons.edit")

  return (
    <div className="text-sm leading-5 border border-[#E5E5E5] rounded-[5px] bg-white">
      {/* Header */}
      <div className="flex justify-between items-center px-5 min-h-[70px] border-b border-[#E5E5E5]">
        <div className="flex items-center gap-5">
          <Info size={20} />
          <p>{title}</p>
        </div>
        {onEdit && (
          <button onClick={onEdit} className="button-orange">
            {buttonText}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="pl-[60px] px-5 py-4 min-h-[70px]">{children}</div>
    </div>
  )
}

export default InfoSection
