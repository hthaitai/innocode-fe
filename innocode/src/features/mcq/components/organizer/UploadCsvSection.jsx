import { Upload } from "lucide-react"

const UploadCsvSection = () => (
  <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5">
    <div className="flex justify-between items-center">
      <div className="flex gap-5 items-center">
        <Upload size={20} />
        <div>
          <p className="text-[14px] leading-[20px]">Upload CSV File</p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            Upload a CSV file containing your questions
          </p>
        </div>
      </div>
      <button className="button-orange">Choose File</button>
    </div>
  </div>
)

export default UploadCsvSection
