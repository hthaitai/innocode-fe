import React, { useEffect, useState } from "react"
import BaseModal from "@/shared/components/BaseModal"
import TextFieldFluent from "@/shared/components/TextFieldFluent"
import { useInviteJudgeToContestMutation } from "@/services/contestJudgeApi"
import { toast } from "react-hot-toast"
import { sendJudgeInviteEmail } from "../../../shared/services/emailService"

export default function InviteJudgeModal({
  isOpen,
  onClose,
  contestId,
  judgeUserId,
  judgeName,
  judgeEmail,
}) {
  const [ttlDays, setTtlDays] = useState(1)
  const [error, setError] = useState("")
  const [inviteJudgeToContest, { isLoading }] =
    useInviteJudgeToContestMutation()
  const [sendingEmail, setSendingEmail] = useState(false)

  const MIN_TTL = 1
  const MAX_TTL = 60

  useEffect(() => {
    if (isOpen) {
      setTtlDays(1)
      setError("")
    }
  }, [isOpen])

  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10)
    if (isNaN(val) || val < MIN_TTL || val > MAX_TTL) {
      setError(`Please enter a number between ${MIN_TTL} and ${MAX_TTL}`)
    } else {
      setError("")
    }
    setTtlDays(val || "")
  }

  const handleSubmit = async () => {
    if (!contestId || !judgeUserId)
      return toast.error("Missing contest or judge info")
    if (error || !ttlDays) return

    try {
      const result = await inviteJudgeToContest({
        contestId,
        judgeUserId,
        ttlDays,
      }).unwrap()

      const { inviteCode, contestName } = result.data

      const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin
      const acceptUrl = `${baseUrl}/judge/accept?inviteCode=${inviteCode}`
      const declineUrl = `${baseUrl}/judge/decline?inviteCode=${inviteCode}`

      setSendingEmail(true)
      await sendJudgeInviteEmail({
        judgeEmail,
        judgeName,
        contestName,
        acceptUrl,
        declineUrl,
      })
      setSendingEmail(false)

      toast.success("Invite sent and email delivered!")
      onClose()
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.message || "Failed to send invite")
    }
  }

  const loading = isLoading || sendingEmail

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite judge"
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <button className="button-white" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className={`flex items-center gap-2 justify-center ${
              loading || !!error || !ttlDays ? "button-gray" : "button-orange"
            }`}
            onClick={handleSubmit}
            disabled={loading || !!error || !ttlDays}
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
            )}

            {loading ? "Inviting..." : "Invite"}
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-sm leading-5 text-[#7A7574]">
          You are about to invite <strong>{judgeName || "this judge"}</strong>
          {judgeEmail ? ` (${judgeEmail})` : ""} to this contest. <br />
          Set how long the judge has to accept the invitation before it expires.
          After this period, the invite will no longer be valid.
        </p>

        <TextFieldFluent
          label="Invite expiration (days)"
          type="number"
          min={MIN_TTL}
          max={MAX_TTL}
          value={ttlDays}
          onChange={handleChange}
          error={!!error}
          helperText={error}
        />
      </div>
    </BaseModal>
  )
}
