import React from "react"
import { Download } from "lucide-react"
import { toast } from "react-hot-toast"
import { useLazyGetContestReportQuery } from "../../../services/contestApi"
import { useTranslation } from "react-i18next"

const LeaderboardToolbar = ({ contestId }) => {
  const { t } = useTranslation(["leaderboard"])
  const [trigger, { isLoading }] = useLazyGetContestReportQuery()

  const handleDownloadReport = async () => {
    try {
      const result = await trigger(contestId).unwrap()
      if (result?.url) {
        window.open(result.url, "_blank")
        toast.success(t("leaderboard:toolbar.reportDownloading"))
      } else {
        toast.error(t("leaderboard:toolbar.reportUrlNotFound"))
      }
    } catch (err) {
      console.error(err)
      toast.error(t("leaderboard:toolbar.downloadError"))
    }
  }

  return (
    <div className="flex justify-end items-center mb-3">
      <button
        type="button"
        onClick={handleDownloadReport}
        disabled={isLoading}
        className={`${isLoading ? "button-gray" : "button-orange"}`}
      >
        {t("leaderboard:toolbar.download")}
      </button>
    </div>
  )
}

export default LeaderboardToolbar
