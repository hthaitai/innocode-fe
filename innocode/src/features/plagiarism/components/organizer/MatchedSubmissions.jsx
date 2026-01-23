import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"
import { FileCode, Download } from "lucide-react"
import { formatDateTime } from "@/shared/utils/dateTime"
import ExpandableCard from "@/shared/components/ExpandableCard"
import TestCaseResults from "./TestCaseResults"

const MatchedSubmissions = ({ matches }) => {
  const { t } = useTranslation(["plagiarism", "common"])

  const handleDownload = async (fileUrl, filename, e) => {
    e.stopPropagation() // Prevent card expansion when clicking download
    try {
      const res = await fetch(fileUrl)
      const blob = await res.blob()

      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed", error)
      toast.error(t("common:common.failedToDownloadFile"))
    }
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
        {t("common:common.noResults")}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {matches.map((match) => {
        return (
          <ExpandableCard
            key={match.submissionId}
            icon={<FileCode size={20} />}
            header={
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="text-[14px] leading-[20px]">
                    {match.studentName || "—"}
                  </p>
                  <div className="flex items-center gap-2 text-[12px] leading-[16px] text-[#7A7574]">
                    <span>{match.teamName || "—"}</span>
                    <span>|</span>
                    <span>{formatDateTime(match.submittedAt)}</span>
                    <span>|</span>
                    <span>
                      {t("score")}:{" "}
                      {match.score !== undefined && match.score !== null
                        ? match.score
                        : "—"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  {match.artifacts?.[0] && (
                    <button
                      onClick={(e) =>
                        handleDownload(
                          match.artifacts[0].url,
                          `submission-${match.artifacts[0].artifactId}.${match.artifacts[0].url
                            .split(".")
                            .pop()}`,
                          e,
                        )
                      }
                      className="button-orange"
                    >
                      {t("common:buttons.download")}
                    </button>
                  )}
                </div>
              </div>
            }
          >
            <div className="py-2">
              <TestCaseResults details={match.details || []} />
            </div>
          </ExpandableCard>
        )
      })}
    </div>
  )
}

export default MatchedSubmissions
