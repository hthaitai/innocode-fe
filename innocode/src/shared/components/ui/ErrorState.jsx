import { useTranslation } from "react-i18next"

export function ErrorState({ itemName, message }) {
  const { t } = useTranslation("common")
  return (
    <div
      className={`text-red-600 text-sm leading-5 border border-red-200 rounded-[5px] bg-red-50 flex items-center justify-center px-5 min-h-[70px]`}
    >
      <p className="text-xs leading-4">
        {message ||
          (itemName
            ? t("common.failedToLoadItem", { item: itemName })
            : t("common.somethingWentWrong"))}
      </p>
    </div>
  )
}
