import React from "react"
import { Download } from "lucide-react"
import { toast } from "react-hot-toast"
import { useLazyGetContestReportQuery } from "../../../services/contestApi"

const LeaderboardToolbar = ({ contestId }) => {
  const [trigger, { isLoading }] = useLazyGetContestReportQuery()

  const handleDownloadReport = async () => {
    try {
      const result = await trigger(contestId).unwrap()
      if (result?.url) {
        window.open(result.url, "_blank")
        toast.success("Report downloading...")
      } else {
        toast.error("Report URL not found")
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to download report")
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
        Download
      </button>
    </div>
  )
}

export default LeaderboardToolbar
