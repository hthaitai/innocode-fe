import React from "react"
import {
  Clock,
  Cpu,
  FileCode,
  Download,
  CheckCircle2,
  XCircle,
} from "lucide-react"

const AutoResultExpandedRow = ({ details = [], artifacts = [] }) => {
  if (!details.length && !artifacts.length) return null

  // Function to fetch the file content and trigger download
  const handleDownload = async (fileUrl, filename) => {
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

      URL.revokeObjectURL(url) // cleanup
    } catch (error) {
      console.error("Download failed", error)
      alert("Failed to download file.")
    }
  }

  return (
    <div className="px-5">
      {/* Test Cases Section */}
      {details.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-sm leading-5 text-gray-800 mb-2">
            Test Cases ({details.length})
          </h3>
          <div className="space-y-2">
            {details.map((d, index) => (
              <div
                key={d.detailsId}
                className="p-2 border border-gray-200 rounded-sm"
              >
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  {d.note === "success" ? (
                    <div className="flex items-center gap-1 text-green-700 text-xs font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      PASSED
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-700 text-xs font-semibold">
                      <XCircle className="w-3 h-3" />
                      FAILED
                    </div>
                  )}

                  <span className="text-sm text-gray-700">
                    Test Case {index + 1}
                  </span>

                  <span className="text-sm text-gray-700">
                    Weight: <span className="font-medium">{d.weight}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    Runtime:{" "}
                    <span className="font-medium">{d.runtimeMs}ms</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Cpu className="w-4 h-4 text-gray-500" />
                    Memory: <span className="font-medium">{d.memoryKb}KB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Code Section */}
      {artifacts.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm leading-5 text-gray-800 mb-2">
            Submitted Files
          </h3>
          <div className="space-y-2">
            {artifacts.map((a) => (
              <div
                key={a.artifactId}
                className="flex items-center justify-between p-2 border border-gray-200 rounded-sm"
              >
                <div className="flex items-center gap-2 text-sm text-gray-800">
                  <FileCode className="w-4 h-4" />
                  <span>submission-{a.artifactId}.py</span>
                </div>

                <button
                  onClick={() =>
                    handleDownload(a.url, `submission-${a.artifactId}.py`)
                  }
                  className="button-orange flex items-center pl-4 gap-2"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AutoResultExpandedRow
