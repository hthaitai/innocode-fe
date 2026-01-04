import React from "react"
import { FileCode, Download } from "lucide-react"
import { useTranslation } from "react-i18next"

const AutoResultArtifacts = ({ artifacts }) => {
  const { t } = useTranslation("common")
  const handleDownload = async (fileUrl, filename) => {
    try {
      const res = await fetch(fileUrl)
      const text = await res.text() // get the file content

      const blob = new Blob([text], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url) // cleanup
    } catch (error) {
      console.error("Download failed", error)
      alert(t("common.failedToDownloadFile"))
    }
  }

  return (
    <div className="space-y-1">
      {!artifacts || artifacts.length === 0 ? (
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          {t("common.noSubmittedFilesAvailable")}
        </div>
      ) : (
        artifacts.map((artifact, index) => (
          <div
            key={artifact.artifactId || index}
            className="text-sm leading-5 flex justify-between items-center px-5 min-h-[70px] border border-[#E5E5E5] rounded-[5px] bg-white"
          >
            <div className="flex items-center gap-5">
              <FileCode size={20} />
              <span>submission-{artifact.artifactId}.py</span>
            </div>

            <button
              onClick={() =>
                handleDownload(
                  artifact.url,
                  `submission-${artifact.artifactId}.py`
                )
              }
              className="button-orange"
            >
              {t("buttons.download")}
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default AutoResultArtifacts
