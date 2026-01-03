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
      title: "Confirm plagiarism",
      description: `Are you sure you want to confirm that this submission is plagiarism? It will be disqualified from the contest.`,
      onConfirm: async () => {
        try {
          await approvePlagiarism(submissionId).unwrap()
          toast.success("Plagiarism case confirmed successfully!")
          navigate(`/organizer/contests/${contestId}/plagiarism`)
        } catch (err) {
          console.error(err)
          const errorMessage =
            err?.data?.message ||
            err?.data?.Message ||
            err?.error ||
            "Failed to confirm plagiarism case"
          toast.error(errorMessage)
        }
      },
    })
  }

  const handleDeny = () => {
    openModal("confirm", {
      title: "Dismiss plagiarism case",
      description: `Are you sure you want to dismiss this plagiarism case? The submission will be considered valid.`,
      onConfirm: async () => {
        try {
          await denyPlagiarism(submissionId).unwrap()
          toast.success("Plagiarism case dismissed successfully!")
          navigate(`/organizer/contests/${contestId}/plagiarism`)
        } catch (err) {
          console.error(err)
          const errorMessage =
            err?.data?.message ||
            err?.data?.Message ||
            err?.error ||
            "Failed to dismiss plagiarism case"
          toast.error(errorMessage)
        }
      },
    })
  }

  return (
    <div>
      <div className="text-sm font-semibold pt-3 pb-2">Actions</div>
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex gap-5 justify-between items-center min-h-[70px]">
        <div className="flex items-center gap-5">
          <Scale size={20} />
          <div className="flex flex-col justify-center">
            <p className="text-[14px] leading-[20px]">
              Resolve plagiarism case
            </p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              Do you agree that this submission is plagiarism and will not be
              counted in the contest?
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="button-white"
            onClick={handleDeny}
            disabled={isApproving || isDenying}
          >
            {isDenying ? "Processing..." : "No"}
          </button>
          <button
            className="button-orange"
            onClick={handleApprove}
            disabled={isApproving || isDenying}
          >
            {isApproving ? "Processing..." : "Yes"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResolveAction
