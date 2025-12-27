import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAcceptJudgeInviteMutation } from "../../../services/contestJudgeApi"
import { useAuth } from "@/context/AuthContext"

export default function JudgeInviteAccept() {
  const [params] = useSearchParams()
  const inviteCode = params.get("inviteCode")
  const email = params.get("email")
  const navigate = useNavigate()
  const { user } = useAuth()

  console.log(user)

  const [acceptInvite] = useAcceptJudgeInviteMutation()

  useEffect(() => {
    async function handleAccept() {
      const judgeEmail = email || user?.email
      if (!judgeEmail) {
        toast.error("Email is required to accept the invitation.")
        navigate("/")
        return
      }

      try {
        await acceptInvite({ inviteCode, email: judgeEmail }).unwrap()
        toast.success("Invitation accepted successfully!")
        navigate("/")
      } catch (err) {
        toast.error(err?.data?.message || "Failed to accept invitation.")
        navigate("/")
      }
    }

    if (inviteCode) handleAccept()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode, email])

  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold">Processing your acceptance…</h2>
    </div>
  )
}
