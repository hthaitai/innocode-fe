import React, { useState, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Download, Upload } from "lucide-react"
import { toast } from "react-hot-toast"
import {
  useImportMcqCsvMutation,
  useGetMcqTemplateQuery,
} from "@/services/mcqApi"

const CsvImportSection = ({ testId, onUpload }) => {
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()

  const { data: templateData, isFetching: fetchingTemplate } =
    useGetMcqTemplateQuery()
  const [importMcqCsv, { isLoading: importingCsv }] = useImportMcqCsvMutation()

  // Download CSV Template
  const handleDownloadTemplate = () => {
    const url = templateData?.data
    if (!url) return toast.error("Could not fetch template URL.")

    const link = document.createElement("a")
    link.href = url
    link.download = "mcq_import_template.csv"
    document.body.appendChild(link)
    link.click()
    link.remove()

    toast.success("Template downloaded!")
  }

  // File selection
  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    if (selected.type !== "text/csv") {
      toast.error("Please select a valid CSV file.")
      return
    }
    setFile(selected)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (!droppedFile) return
    if (droppedFile.type !== "text/csv") {
      toast.error("Please drop a valid CSV file.")
      return
    }
    setFile(droppedFile)
  }

  const handleDragOver = (e) => e.preventDefault()

  // Import CSV
  const handleImportCsv = async () => {
    if (!file) return toast.error("Please select a CSV file first.")

    const formData = new FormData()
    formData.append("csvFile", file)
    formData.append("bankStatus", "Public")

    try {
      setImporting(true)
      const result = await importMcqCsv({ testId, formData }).unwrap()
      toast.success("CSV imported successfully!")
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (onUpload && result?.data) onUpload(result.data.questions)
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Import failed.")
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white rounded-tl-none">
      {/* Download Template */}
      <div className="px-5 py-4 flex justify-between items-center border-b border-[#E5E5E5]">
        <div className="flex items-center gap-5">
          <Download size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">Download CSV Template</p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              Get a pre-made template to import your questions quickly.
            </p>
          </div>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="button-orange"
          disabled={fetchingTemplate}
        >
          {fetchingTemplate ? "Fetching..." : "Download"}
        </button>
      </div>

      {/* Upload Section */}
      <div className="p-5 space-y-8">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full h-[188px] flex flex-col items-center justify-center border-1 border-dashed border-[#909090] rounded-[5px] cursor-pointer hover:border-orange-400 transition"
          onClick={() => fileInputRef.current.click()}
        >
          <Upload className="text-[#7A7574]" size={20} />
          <p className="mt-2 text-[12px] leading-[16px] text-[#7A7574]">
            {file
              ? file.name
              : "Drag & drop your CSV file here or click to select"}
          </p>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {file && (
          <div className="flex justify-end">
            <button
              onClick={handleImportCsv}
              disabled={importingCsv || importing}
              className={
                importing || importingCsv
                  ? "button-gray cursor-not-allowed"
                  : "button-orange"
              }
            >
              {importing || importingCsv ? "Importing..." : "Import CSV"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CsvImportSection
