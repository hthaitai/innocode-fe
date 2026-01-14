import { useTranslation } from "react-i18next"
import { FileText } from "lucide-react"
import { formatDateTime } from "@/shared/utils/dateTime"

export default function AppealEvidences({ evidences }) {
  console.log(evidences)
  const { t } = useTranslation(["appeal"])

  return (
    <div className="flex flex-col gap-1">
      {evidences?.length ? (
        evidences.map((evidence) => (
          <div
            key={evidence.evidenceId}
            className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]"
          >
            <div className="flex items-center gap-5">
              <FileText size={20} />
              <div className="flex flex-col justify-center">
                <p className="text-[14px] leading-[20px]">
                  {evidence.note || t("noNote")}
                </p>
                <p className="text-[12px] leading-[16px] text-[#7A7574]">
                  {formatDateTime(evidence.createdAt)}
                </p>
              </div>
            </div>

            <button
              className="button-white"
              onClick={() =>
                window.open(evidence.url, "_blank", "noopener,noreferrer")
              }
            >
              {t("download")}
            </button>
          </div>
        ))
      ) : (
        <p className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          {t("noEvidences")}
        </p>
      )}
    </div>
  )
}
