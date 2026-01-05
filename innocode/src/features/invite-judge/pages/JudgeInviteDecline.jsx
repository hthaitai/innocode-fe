import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useDeclineJudgeInviteMutation } from "../../../services/contestJudgeApi"
import { useAuth } from "@/context/AuthContext"

export default function JudgeInviteDecline() {
  const [params] = useSearchParams()
  const inviteCode = params.get("inviteCode")
  const email = params.get("email")
  const navigate = useNavigate()
  const { t } = useTranslation("judge")
  const { user } = useAuth()

  const [declineInvite] = useDeclineJudgeInviteMutation()

  useEffect(() => {
    async function handleDecline() {
      const judgeEmail = email || user?.email
      if (!judgeEmail) {
        toast.error(
          t("inviteResponse.emailRequiredAction", {
            action: t("inviteResponse.declineButton").toLowerCase(),
          })
        )
        navigate("/")
        return
      }

      try {
        await declineInvite({ inviteCode, email: judgeEmail }).unwrap()
        toast.success(t("inviteResponse.messages.declineToast"))
        navigate("/")
      } catch (err) {
        toast.error(
          err?.data?.message || t("inviteResponse.messages.declineFailed")
        )
        navigate("/")
      }
    }

    if (inviteCode) handleDecline()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode, email])

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">
        {t("inviteResponse.processingResponse")}
      </h2>
    </div>
  )
}
