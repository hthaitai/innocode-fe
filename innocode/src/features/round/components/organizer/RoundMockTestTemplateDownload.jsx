import React from "react"
import { useTranslation } from "react-i18next"
import { FileDown, FileCode, Download } from "lucide-react"
import { useGetOrganizerMockTestTemplateQuery } from "@/services/roundApi"

const RoundMockTestTemplateDownload = () => {
  const { t } = useTranslation("round")
  const { data: templateData } = useGetOrganizerMockTestTemplateQuery()

  if (!templateData) return null

  return (
    <div className="flex flex-col gap-1">
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex gap-5 items-center">
          <Download size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">
              {t("mockTest.templateTitle")}
            </p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              {t("mockTest.templateDescription")}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="button-white px-3"
          onClick={() => {
            const link = document.createElement("a")
            link.href = templateData
            link.setAttribute("download", "")
            link.target = "_blank"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }}
        >
          {t("mockTest.downloadTemplate")}
        </button>
      </div>
    </div>
  )
}

export default RoundMockTestTemplateDownload
