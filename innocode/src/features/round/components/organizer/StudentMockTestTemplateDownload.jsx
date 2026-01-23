import React from "react"
import { useTranslation } from "react-i18next"
import Label from "@/shared/components/form/Label"
import { useGetStudentMockTestTemplateQuery } from "@/services/roundApi"

const StudentMockTestTemplateDownload = () => {
  const { t } = useTranslation("round")
  const { data: templateData } = useGetStudentMockTestTemplateQuery()

  if (!templateData) return null

  return (
    <div className="flex flex-col gap-2">
      <Label>{t("form.downloadStudentTemplateLabel")}</Label>
      <button
        type="button"
        className="button-white px-3 w-fit"
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
        {t("detail.downloadStudentTemplate")}
      </button>
    </div>
  )
}

export default StudentMockTestTemplateDownload
