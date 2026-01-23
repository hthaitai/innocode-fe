import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAcceptJudgeInviteMutation } from "../../../services/contestJudgeApi"
import { useAuth } from "@/context/AuthContext"
import { isFetchError } from "@/shared/utils/apiUtils"

export default function JudgeInviteAccept() {
  const [params] = useSearchParams()
  const inviteCode = params.get("inviteCode")
  const email = params.get("email")
  const navigate = useNavigate()
  const { t } = useTranslation("judge")
  const { user } = useAuth()
  const attemptedRef = useRef(false)

  const [acceptInvite] = useAcceptJudgeInviteMutation()

  useEffect(() => {
    async function handleAccept() {
      const judgeEmail = email || user?.email
      if (!judgeEmail) {
        toast.error(
          t("inviteResponse.emailRequiredAction", {
            action: t("inviteResponse.acceptButton").toLowerCase(),
          }),
        )
        navigate("/")
        return
      }

      try {
        await acceptInvite({ inviteCode, email: judgeEmail }).unwrap()
        toast.success(t("inviteResponse.messages.acceptToast"))
        navigate("/")
      } catch (err) {
        console.error("Error accepting judge invite:", err)
        if (isFetchError(err)) return

        toast.error(
          err?.data?.message || t("inviteResponse.messages.acceptFailed"),
        )
        navigate("/")
      }
    }

    if (inviteCode && !attemptedRef.current) {
      attemptedRef.current = true
      handleAccept()
    }
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
