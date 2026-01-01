import React, { useCallback, useMemo } from "react"
import TableFluent from "@/shared/components/TableFluent"
import JudgeInvitationsToolbar from "./JudgeInvitationsToolbar"
import TablePagination from "@/shared/components/TablePagination"
import { getJudgeInviteColumns } from "../../columns/judgeInviteColumns"
import { useModal } from "@/shared/hooks/useModal"
import {
  useResendJudgeInviteMutation,
  useRevokeJudgeInviteMutation,
} from "../../../../services/contestJudgeApi"
import { sendJudgeInviteEmail } from "@/shared/services/emailService"
import { toast } from "react-hot-toast"

const ManageJudgeInvitations = ({
  contestId,
  contestName,
  judges,
  pagination,
  setPageNumber,
}) => {
  const { openModal } = useModal()

  const [resendJudgeInvite] = useResendJudgeInviteMutation()
  const [revokeJudgeInvite] = useRevokeJudgeInviteMutation()

  // Invite handler (per row)
  const handleInvite = useCallback(
    (judge) => {
      if (!judge) return

      openModal("inviteJudge", {
        contestId,
        judgeUserId: judge.judgeId,
        judgeName: judge.judgeName,
        judgeEmail: judge.judgeEmail,
      })
    },
    [contestId, openModal]
  )

  const handleResend = useCallback(
    async (judge) => {
      if (!judge || !contestId || !judge.inviteId) return

      try {
        const result = await resendJudgeInvite({
          contestId,
          inviteId: judge.inviteId,
        }).unwrap()

        const payload = result?.data || result || {}
        const inviteCode = payload.inviteCode
        const contestNameFromPayload =
          payload.contestName || contestName || "Contest"
        const judgeEmail = judge.judgeEmail
        const judgeName = judge.judgeName || "Judge"

        if (!inviteCode) {
          toast.error("Unable to resend invite (missing invite code)")
          return
        }
        if (!judgeEmail) {
          toast.error("Unable to resend invite (missing judge email)")
          return
        }

        const baseUrl =
          import.meta.env.VITE_FRONTEND_URL || window.location.origin
        const acceptUrl = `${baseUrl}/judge/accept?inviteCode=${inviteCode}`
        const declineUrl = `${baseUrl}/judge/decline?inviteCode=${inviteCode}`

        const emailed = await sendJudgeInviteEmail({
          judgeEmail,
          judgeName,
          contestName: contestNameFromPayload,
          acceptUrl,
          declineUrl,
        })

        if (emailed) {
          toast.success(`Invite resent to ${judgeName}`)
        } else {
          toast.error("Invite resent but email failed to send")
        }
      } catch (error) {
        console.error("Failed to resend invite:", error)
        toast.error(`Failed to resend invite to ${judge.judgeName}`)
      }
    },
    [contestId, resendJudgeInvite, contestName]
  )

  const handleRevoke = useCallback(
    async (judge) => {
      if (!judge || !contestId || !judge.inviteId) return

      const confirmed = window.confirm(
        `Are you sure you want to revoke the invite for ${judge.judgeName}?`
      )

      if (!confirmed) return

      try {
        await revokeJudgeInvite({
          contestId,
          inviteId: judge.inviteId,
        }).unwrap()

        toast.success(`Invite revoked for ${judge.judgeName}`)
      } catch (error) {
        console.error("Failed to revoke invite:", error)
        toast.error(`Failed to revoke invite for ${judge.judgeName}`)
      }
    },
    [contestId, revokeJudgeInvite]
  )

  const columns = getJudgeInviteColumns({
    onInvite: handleInvite,
    onResend: handleResend,
    onRevoke: handleRevoke,
  })

  return (
    <div>
      {/* <JudgeInvitationsToolbar /> */}

      <TableFluent data={judges} columns={columns} />

      <TablePagination pagination={pagination} onPageChange={setPageNumber} />
    </div>
  )
}

export default ManageJudgeInvitations
