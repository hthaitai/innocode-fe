import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useDeclineJudgeInviteMutation } from "../../../services/contestJudgeApi"
import { useAuth } from "@/context/AuthContext"

export default function JudgeInviteDecline() {
  const [params] = useSearchParams()
  const inviteCode = params.get("inviteCode")
  const email = params.get("email")
  const navigate = useNavigate()
  const { user } = useAuth()

  const [declineInvite] = useDeclineJudgeInviteMutation()

  useEffect(() => {
    async function handleDecline() {
      const judgeEmail = email || user?.email
      if (!judgeEmail) {
        toast.error("Email is required to decline the invitation.")
        navigate("/")
        return
      }

      try {
        await declineInvite({ inviteCode, email: judgeEmail }).unwrap()
        toast.success("Invitation declined.")
        navigate("/")
      } catch (err) {
        toast.error(err?.data?.message || "Failed to decline invitation.")
        navigate("/")
      }
    }

    if (inviteCode) handleDecline()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode, email])

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Processing your response…</h2>
    </div>
  )
}
