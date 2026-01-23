import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FileCode } from "lucide-react"
import { formatDateTime } from "@/shared/utils/dateTime"
import toast from "react-hot-toast"

const SubmittedFiles = ({ artifacts }) => {
  const { t } = useTranslation(["plagiarism"])
  const [downloadingId, setDownloadingId] = useState(null)

  const handleDownload = async (artifact) => {
    if (downloadingId) return

    setDownloadingId(artifact.artifactId)

    try {
      const res = await fetch(artifact.url)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `submission-${artifact.artifactId}.${artifact.url
        .split(".")
        .pop()}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed", error)
      toast.error(t("downloadFailed"))
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {!artifacts || artifacts.length === 0 ? (
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 min-h-[70px] text-[#7A7574] flex justify-center items-center text-xs leading-4">
          {t("noFiles")}
        </div>
      ) : (
        artifacts.map((artifact) => {
          const isDownloading = downloadingId === artifact.artifactId

          return (
            <div
              key={artifact.artifactId}
              className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]"
            >
              <div className="flex items-center gap-5">
                <FileCode size={20} />
                <div className="flex flex-col justify-center">
                  <p className="text-[14px] leading-[20px]">
                    {t("studentSubmission")}
                  </p>
                  <p className="text-[12px] leading-[16px] text-[#7A7574]">
                    {formatDateTime(artifact.createdAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(artifact)}
                disabled={isDownloading}
                className={`${isDownloading ? "button-gray" : "button-orange"}`}
              >
                {t("download")}
              </button>
            </div>
          )
        })
      )}
    </div>
  )
}

export default SubmittedFiles
