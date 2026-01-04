import React from "react"
import { useTranslation } from "react-i18next"

export function MissingState({ itemName }) {
  const { t } = useTranslation("common")
  return (
    <div
      className={`text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]`}
    >
      {itemName
        ? t("common.itemUnavailable", { item: itemName })
        : t("common.pageDeletedOrUnavailable")}
    </div>
  )
}
