import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAcceptJudgeInviteMutation } from "../../../services/contestJudgeApi"

export default function JudgeInviteAccept() {
  const [params] = useSearchParams()
  const inviteCode = params.get("inviteCode")
  const navigate = useNavigate()

  const [acceptInvite] = useAcceptJudgeInviteMutation()

  useEffect(() => {
    async function handleAccept() {
      try {
        await acceptInvite(inviteCode).unwrap()
        toast.success("Invitation accepted successfully!")
        navigate("/")
      } catch (err) {
        toast.error("Failed to accept invitation.")
        navigate("/")
      }
    }

    if (inviteCode) handleAccept()
  }, [inviteCode])

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Processing your acceptance…</h2>
    </div>
  )
}
