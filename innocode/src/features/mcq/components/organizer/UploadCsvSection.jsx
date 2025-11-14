import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { Upload, FileText, Loader2 } from "lucide-react"
import { importMcqCsv } from "../../store/mcqThunk"
import { toast } from "react-hot-toast"

const UploadCsvSection = ({ testId }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.mcq)
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    if (selected.type !== "text/csv") {
      toast.error("Please select a valid CSV file.")
      return
    }
    setFile(selected)
  }

  const handleImportCsv = async () => {
    if (!file) return toast.error("Please select a CSV file first.")
    const formData = new FormData()
    formData.append("csvFile", file)
    formData.append("bankStatus", "Public")

    try {
      await dispatch(importMcqCsv({ testId, formData })).unwrap()
      toast.success("CSV imported successfully!")
      setFile(null)
      document.getElementById("csvFileInput").value = ""
    } catch (err) {
      toast.error(err?.message || err?.error || "Import failed.")
    }
  }

  return (
    <div className="space-y-1">
      {/* Top Section */}
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5">
        <div className="flex justify-between items-center">
          <div className="flex gap-5 items-center">
            <Upload size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Upload CSV File</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                Upload a CSV file containing your questions for import
              </p>
            </div>
          </div>

          <button
            onClick={() => document.getElementById("csvFileInput").click()}
            disabled={loading}
            className="button-orange"
          >
            Choose File
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 min-h-[70px] flex flex-col justify-center">
        {file ? (
          <div className="flex justify-between items-center">
            <div className="flex gap-5 items-center">
              <FileText size={20} />
              <div>
                <p className="text-[14px] leading-[20px]">{file.name}</p>
                <p className="text-[12px] leading-[16px] text-[#7A7574]">
                  Ready to import this file
                </p>
              </div>
            </div>

            <button
              onClick={handleImportCsv}
              disabled={loading}
              className={`${loading ? "button-gray" : "button-orange"}`}
            >
              Import
            </button>
          </div>
        ) : (
          <p className="text-center text-xs leading-4 text-[#7A7574]">
            No file selected.
          </p>
        )}

        <input
          id="csvFileInput"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

export default UploadCsvSection
