import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useDeclineJudgeInviteMutation } from "../../../services/contestJudgeApi"

export default function JudgeInviteDecline() {
  const [params] = useSearchParams()
  const inviteCode = params.get("inviteCode")
  const navigate = useNavigate()

  const [declineInvite] = useDeclineJudgeInviteMutation()

  useEffect(() => {
    async function handleDecline() {
      try {
        await declineInvite(inviteCode).unwrap()
        toast.success("Invitation declined.")
        navigate("/")
      } catch (err) {
        toast.error("Failed to decline invitation.")
        navigate("/")
      }
    }

    if (inviteCode) handleDecline()
  }, [inviteCode])

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Processing your response…</h2>
    </div>
  )
}
