import { useDispatch, useSelector } from "react-redux"
import { Download } from "lucide-react"
import { fetchMcqTemplate } from "../../store/mcqThunk"
import { toast } from "react-hot-toast"

const DownloadCsvTemplate = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.mcq)

  const handleDownloadTemplate = async () => {
    try {
      const res = await dispatch(fetchMcqTemplate()).unwrap()

      // The API returns data as a direct string URL
      const url =
        typeof res?.data === "string"
          ? res.data
          : res?.data?.url || res?.url || null

      if (url) {
        const link = document.createElement("a")
        link.href = url
        link.download = "mcq_import_template.csv"
        document.body.appendChild(link)
        link.click()
        link.remove()
      } else {
        toast.error("Could not fetch template URL.")
      }
    } catch (err) {
      toast.error(err?.message || "Failed to download template.")
    }
  }

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <Download size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">
              Download Import Template
            </p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              Download a CSV template to import your questions
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="button-white px-3"
          disabled={loading}
        >
          Download Template
        </button>
      </div>
    </div>
  )
}

export default DownloadCsvTemplate
