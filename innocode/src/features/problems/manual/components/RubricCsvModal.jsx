import { useState } from "react"
import BaseModal from "@/shared/components/BaseModal"
import toast from "react-hot-toast"
import {
  useImportRubricCsvMutation,
  useFetchRubricTemplateQuery,
} from "../../../../services/manualProblemApi"

export default function RubricCsvModal({ isOpen, onClose, roundId, contestId }) {
  const { data: templateUrl } = useFetchRubricTemplateQuery()
  const [importRubricCsv, { isLoading: importing }] =
    useImportRubricCsvMutation()
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please select a valid CSV file")
      setSelectedFile(null)
      return
    }
    setSelectedFile(file)
    setError(null)
  }

  const handleImport = async () => {
    if (!selectedFile) {
      setError("Please select a CSV file first")
      return
    }

    try {
      await importRubricCsv({ roundId, file: selectedFile, contestId }).unwrap()
      toast.success("CSV imported successfully")
      setSelectedFile(null)
      onClose()
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || "Failed to import CSV")
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setError(null)
    onClose()
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        className="button-white"
        onClick={handleClose}
        disabled={importing}
      >
        Cancel
      </button>
      <button
        type="button"
        className={importing ? "button-gray" : "button-orange"}
        onClick={handleImport}
        disabled={importing}
      >
        {importing ? "Importing..." : "Import CSV"}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload CSV / Template"
      size="md"
      footer={footer}
    >
      <div className="flex flex-col gap-3">
        {/* Download Template */}
        {templateUrl && (
          <div className="flex flex-col gap-1">
            <label className="text-xs leading-4 mb-1">Select CSV File</label>

            <div>
              <button
                type="button"
                className="button-white px-3"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = templateUrl
                  link.download = "rubric_template.csv"
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
              >
                Download template
              </button>
            </div>
          </div>
        )}

        {/* Button-style File Input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs leading-4 mb-1">Select CSV File</label>

          <button
            type="button"
            className="button-orange w-max"
            onClick={() => document.getElementById("csv-file-input").click()}
          >
            {selectedFile ? "Change CSV" : "Choose CSV"}
          </button>

          <input
            id="csv-file-input"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFile && (
            <p className="text-xs leading-4 text-[#7A7574] truncate mt-1">
              {selectedFile.name}
            </p>
          )}

          {error && <p className="text-xs text-[#D32F2F] mt-1">{error}</p>}
        </div>
      </div>
    </BaseModal>
  )
}
