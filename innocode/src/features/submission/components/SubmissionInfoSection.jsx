import { Download } from "lucide-react"
import InfoSection from "../../../shared/components/InfoSection"
import DetailTable from "../../../shared/components/DetailTable"
import StatusBadge from "../../../shared/components/StatusBadge"
import { useTranslation } from "react-i18next"

export default function SubmissionInfoSection({ submission, onDownload }) {
  const { t } = useTranslation("judge")

  const submissionData = [
    {
      label: t("evaluation.submissionInfo.contestName"),
      value: submission?.contestName,
    },
    {
      label: t("evaluation.submissionInfo.roundName"),
      value: submission?.roundName,
    },
    {
      label: t("evaluation.submissionInfo.status"),
      value: <StatusBadge status={submission?.status} translate="judge" />,
    },
    {
      label: t("evaluation.submissionInfo.judgeEmail"),
      value: submission?.judgeEmail,
    },
  ]

  return (
    <div className="space-y-1">
      <InfoSection title={t("evaluation.submissionInfo.title")}>
        <DetailTable data={submissionData} labelWidth="129px" />
      </InfoSection>

      <div className="border border-[#E5E5E5] bg-white rounded-[5px] px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex gap-5 items-center">
          <Download size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">
              {t("evaluation.submissionInfo.submissionFile")}
            </p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              {t("evaluation.submissionInfo.downloadDesc")}
            </p>
          </div>
        </div>

        <button onClick={onDownload} className="button-orange" type="button">
          {t("evaluation.submissionInfo.download")}
        </button>
      </div>
    </div>
  )
}
