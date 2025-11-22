import React, { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Download, Upload, FileText } from "lucide-react"
import { fetchMcqTemplate, importMcqCsv, fetchRoundMcqs } from "../../store/mcqThunk"
import { toast } from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"

const CsvImportSection = ({ testId, onUploadSuccess }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.mcq)
  const [file, setFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const { contestId, roundId } = useParams()

  // -----------------------------
  // Download CSV Template
  // -----------------------------
  const handleDownloadTemplate = async () => {
    try {
      const res = await dispatch(fetchMcqTemplate()).unwrap()
      const url =
        typeof res?.data === "string"
          ? res.data
          : res?.data?.url || res?.url || null

      if (!url) return toast.error("Could not fetch template URL.")

      const link = document.createElement("a")
      link.href = url
      link.download = "mcq_import_template.csv"
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success("Template downloaded!")
    } catch (err) {
      toast.error(err?.message || "Failed to download template.")
    }
  }

  // -----------------------------
  // File Selection
  // -----------------------------
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

  // -----------------------------
  // Import CSV
  // -----------------------------
  const handleImportCsv = async () => {
    if (!file) return toast.error("Please select a CSV file first.")
    const formData = new FormData()
    formData.append("csvFile", file)
    formData.append("bankStatus", "Public")

    try {
      setImporting(true)
      const result = await dispatch(importMcqCsv({ testId, formData })).unwrap()
      toast.success("CSV imported successfully!")
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      if (onUploadSuccess && result?.data) {
        onUploadSuccess(result.data)
      }

      // Refetch mcqs for this round and navigate back to list
      if (roundId) {
        await dispatch(fetchRoundMcqs({ roundId, pageNumber: 1, pageSize: 10 })).unwrap()
      }
      if (contestId && roundId) {
        navigate(`/organizer/contests/${contestId}/rounds/${roundId}/mcqs`)
      }
    } catch (err) {
      toast.error(err?.message || err?.error || "Import failed.")
    } finally {
      setImporting(false)
    }
  }

  // -----------------------------
  // UI
  // -----------------------------
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
          disabled={loading}
          className="button-orange"
        >
          Download
        </button>
      </div>

      {/* Upload Section */}
      <div className="p-5 space-y-8">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full h-[210px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-[5px] cursor-pointer hover:border-orange-400 transition"
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
              disabled={loading || importing}
              className={`${
                importing ? "button-gray cursor-not-allowed" : "button-orange"
              }`}
            >
              {importing ? "Importing..." : "Import CSV"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CsvImportSection
