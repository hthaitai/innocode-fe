import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAcceptJudgeInviteMutation } from "../../../services/contestJudgeApi"
import { useAuth } from "@/context/AuthContext"

export default function JudgeInviteAccept() {
  const [params] = useSearchParams()
  const inviteCode = params.get("inviteCode")
  const email = params.get("email")
  const navigate = useNavigate()
  const { t } = useTranslation("judge")
  const { user } = useAuth()

  console.log(user)

  const [acceptInvite] = useAcceptJudgeInviteMutation()

  useEffect(() => {
    async function handleAccept() {
      const judgeEmail = email || user?.email
      if (!judgeEmail) {
        toast.error(
          t("inviteResponse.emailRequiredAction", {
            action: t("inviteResponse.acceptButton").toLowerCase(),
          })
        )
        navigate("/")
        return
      }

      try {
        await acceptInvite({ inviteCode, email: judgeEmail }).unwrap()
        toast.success(t("inviteResponse.messages.acceptToast"))
        navigate("/")
      } catch (err) {
        toast.error(
          err?.data?.message || t("inviteResponse.messages.acceptFailed")
        )
        navigate("/")
      }
    }

    if (inviteCode) handleAccept()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode, email])

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">
        {t("inviteResponse.processingAccept")}
      </h2>
    </div>
  )
}
