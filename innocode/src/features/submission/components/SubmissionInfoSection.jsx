import { Download } from "lucide-react"
import InfoSection from "../../../shared/components/InfoSection"
import DetailTable from "../../../shared/components/DetailTable"
import StatusBadge from "../../../shared/components/StatusBadge"

export default function SubmissionInfoSection({ submission, onDownload }) {
  const submissionData = [
    { label: "Author", value: submission?.submitedByStudentName },
    { label: "Team name", value: submission?.teamName },
    { label: "Contest name", value: submission?.contestName },
    { label: "Round name", value: submission?.roundName },
    { label: "Status", value: <StatusBadge status={submission?.status} /> },
    { label: "Judge email", value: submission?.judgeEmail },
  ]

  return (
    <div className="space-y-1">
      <InfoSection title="Submission information">
        <DetailTable data={submissionData} labelWidth="112px"/>
      </InfoSection>

      <div className="border border-[#E5E5E5] bg-white rounded-[5px] px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex gap-5 items-center">
          <Download size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">Submission</p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              Download the submitted files for review.
            </p>
          </div>
        </div>

        <button onClick={onDownload} className="button-orange" type="button">
          Download
        </button>
      </div>
    </div>
  )
}
