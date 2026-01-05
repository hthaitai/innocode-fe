import { useTranslation } from "react-i18next"
import { Scale } from "lucide-react"
import { useModal } from "@/shared/hooks/useModal"
import {
  useApprovePlagiarismMutation,
  useDenyPlagiarismMutation,
} from "@/services/plagiarismApi"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const ResolveAction = ({ contestId, submissionId, plagiarismData }) => {
  const { t } = useTranslation(["plagiarism"])
  const { openModal, closeModal } = useModal()
  const navigate = useNavigate()

  const [approvePlagiarism, { isLoading: isApproving }] =
    useApprovePlagiarismMutation()
  const [denyPlagiarism, { isLoading: isDenying }] = useDenyPlagiarismMutation()

  const handleApprove = () => {
    openModal("confirm", {
      title: t("confirmPlagiarismTitle"),
      description: t("confirmPlagiarismDesc"),
      confirmText: t("actions_accept"),
      cancelText: t("cancel"),
      onConfirm: async () => {
        try {
          await approvePlagiarism(submissionId).unwrap()
          toast.success(t("confirmSuccess"))
          closeModal()
          navigate(`/organizer/contests/${contestId}/plagiarism`)
        } catch (err) {
          console.error(err)
          const errorMessage =
            err?.data?.message ||
            err?.data?.Message ||
            err?.error ||
            t("confirmError")
          toast.error(errorMessage)
        }
      },
    })
  }

  const handleDeny = () => {
    openModal("confirm", {
      title: t("dismissPlagiarismTitle"),
      description: t("dismissPlagiarismDesc"),
      confirmText: t("actions_deny"),
      cancelText: t("cancel"),
      onConfirm: async () => {
        try {
          // Deny Plagiarism Case = Mark as Valid = Accept Submission
          await denyPlagiarism(submissionId).unwrap()
          toast.success(t("dismissSuccess"))
          closeModal()
          navigate(`/organizer/contests/${contestId}/plagiarism`)
        } catch (err) {
          console.error(err)
          const errorMessage =
            err?.data?.message ||
            err?.data?.Message ||
            err?.error ||
            t("dismissError")
          toast.error(errorMessage)
        }
      },
    })
  }

  return (
    <div>
      <div className="text-sm font-semibold pt-3 pb-2">{t("actions")}</div>
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex gap-5 justify-between items-center min-h-[70px]">
        <div className="flex items-center gap-5">
          <Scale size={20} />
          <div className="flex flex-col justify-center">
            <p className="text-[14px] leading-[20px]">
              {t("resolvePlagiarismCase")}
            </p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              {t("resolveDescription")}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="button-red"
            onClick={handleDeny}
            disabled={isApproving || isDenying}
          >
            {isDenying ? t("processing") : t("actions_deny")}
          </button>
          <button
            className="button-green"
            onClick={handleApprove}
            disabled={isApproving || isDenying}
          >
            {isApproving ? t("processing") : t("actions_accept")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResolveAction
