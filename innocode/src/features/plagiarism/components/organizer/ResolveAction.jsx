import { Scale } from "lucide-react"
import { useModal } from "@/shared/hooks/useModal"
import {
  useApprovePlagiarismMutation,
  useDenyPlagiarismMutation,
} from "@/services/plagiarismApi"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const ResolveAction = ({ contestId, submissionId, plagiarismData }) => {
  const { openModal } = useModal()
  const navigate = useNavigate()

  const [approvePlagiarism, { isLoading: isApproving }] =
    useApprovePlagiarismMutation()
  const [denyPlagiarism, { isLoading: isDenying }] = useDenyPlagiarismMutation()

  const handleApprove = () => {
    openModal("confirm", {
      title: "Approve Plagiarism Case",
      description: `Are you sure you want to approve this plagiarism case for submission ${submissionId}?`,
      onConfirm: async () => {
        try {
          await approvePlagiarism(submissionId).unwrap()
          toast.success("Plagiarism case approved successfully!")
          navigate(`/organizer/contests/${contestId}/plagiarism`)
        } catch (err) {
          const errorMessage =
            err?.data?.message ||
            err?.data?.Message ||
            err?.error ||
            "Failed to approve plagiarism case"
          toast.error(errorMessage)
        }
      },
    })
  }

  const handleDeny = () => {
    openModal("confirm", {
      title: "Deny Plagiarism Case",
      description: `Are you sure you want to deny this plagiarism case for submission ${submissionId}?`,
      onConfirm: async () => {
        try {
          await denyPlagiarism(submissionId).unwrap()
          toast.success("Plagiarism case denied successfully!")
          navigate(`/organizer/contests/${contestId}/plagiarism`)
        } catch (err) {
          const errorMessage =
            err?.data?.message ||
            err?.data?.Message ||
            err?.error ||
            "Failed to deny plagiarism case"
          toast.error(errorMessage)
        }
      },
    })
  }

  return (
    <div>
      <div className="text-sm font-semibold pt-3 pb-2">Actions</div>
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex gap-5 justify-between items-center min-h-[70px] hover:bg-[#F6F6F6] transition-colors">
        <div className="flex items-center gap-5">
          <Scale size={20} />
          <div className="flex flex-col justify-center">
            <p className="text-[14px] leading-[20px]">
              Resolve plagiarism case
            </p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              Approve or deny this plagiarism case
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="button-white"
            onClick={handleDeny}
            disabled={isApproving || isDenying}
          >
            {isDenying ? "Denying..." : "Deny"}
          </button>
          <button
            className="button-orange"
            onClick={handleApprove}
            disabled={isApproving || isDenying}
          >
            {isApproving ? "Approving..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResolveAction
