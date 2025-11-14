import { Upload } from "lucide-react"
import { usePublishContest } from "../../hooks/usePublishContest"

const PublishContestSection = ({ contest }) => {
  if (!contest) return null

  const { handlePublish, disabled, buttonText, helperText, loading, isReady } =
    usePublishContest(contest)

  return (
    <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
      <div className="flex gap-5 items-center">
        <Upload size={20} />
        <div>
          <p className="text-[14px] leading-[20px]">Publish contest</p>
          <p className="text-[12px] leading-[16px] text-[#7A7574]">
            {helperText}
          </p>
        </div>
      </div>

      <button
        onClick={handlePublish}
        disabled={disabled || !isReady}
        className={`${
          disabled || !isReady
            ? "button-gray cursor-not-allowed"
            : "button-orange"
        } ${loading ? "opacity-70" : ""}`}
      >
        {buttonText}
      </button>
    </div>
  )
}

export default PublishContestSection
