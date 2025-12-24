import React from "react"
import BaseModal from "@/shared/components/BaseModal"
import {
  useApprovePlagiarismMutation,
  useDenyPlagiarismMutation,
} from "@/services/plagiarismApi"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function ResolvePlagiarismModal({
  isOpen,
  contestId,
  submissionId,
  plagiarism,
  onClose,
}) {
  const navigate = useNavigate()

  const [approvePlagiarism, { isLoading: isApproving }] =
    useApprovePlagiarismMutation()
  const [denyPlagiarism, { isLoading: isDenying }] = useDenyPlagiarismMutation()

  if (!submissionId) return null

  const isLoading = isApproving || isDenying

  const handleApprove = async () => {
    try {
      await approvePlagiarism(submissionId).unwrap()
      toast.success("Plagiarism case approved successfully!")
      onClose()
      navigate(`/organizer/contests/${contestId}/plagiarism`)
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.data?.Message ||
        err?.error ||
        "Failed to approve plagiarism case"
      toast.error(errorMessage)
    }
  }

  const handleDeny = async () => {
    try {
      await denyPlagiarism(submissionId).unwrap()
      toast.success("Plagiarism case denied successfully!")
      onClose()
      navigate(`/organizer/contests/${contestId}/plagiarism`)
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.data?.Message ||
        err?.error ||
        "Failed to deny plagiarism case"
      toast.error(errorMessage)
    }
  }

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        className={`${isApproving ? "button-gray" : "button-orange"}`}
        onClick={handleApprove}
        disabled={isLoading}
      >
        {isApproving ? "Approving..." : "Approve"}
      </button>

      <button
        type="button"
        className={`${isDenying ? "button-gray" : "button-white"}`}
        onClick={handleDeny}
        disabled={isLoading}
      >
        {isDenying ? "Denying..." : "Deny"}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Resolve Plagiarism: Submission ${submissionId}`}
      size="md"
      footer={footer}
    >
      <p className="text-sm leading-5">
        Are you sure you want to resolve this plagiarism case? Choose to approve
        or deny.
      </p>
    </BaseModal>
  )
}
