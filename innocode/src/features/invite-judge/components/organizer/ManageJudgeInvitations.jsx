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
import { useTranslation } from "react-i18next"

const ManageJudgeInvitations = ({
  contestId,
  contestName,
  judges,
  pagination,
  setPageNumber,
}) => {
  const { openModal } = useModal()
  const { t } = useTranslation("judge")

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
          toast.error(t("manageInvitations.missingInviteCode"))
          return
        }
        if (!judgeEmail) {
          toast.error(t("manageInvitations.missingJudgeEmail"))
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
          toast.success(
            t("manageInvitations.inviteResentSuccess", { name: judgeName })
          )
        } else {
          toast.error(t("manageInvitations.inviteResentEmailFailed"))
        }
      } catch (error) {
        console.error("Failed to resend invite:", error)
        toast.error(
          t("manageInvitations.inviteResentError", { name: judge.judgeName })
        )
      }
    },
    [contestId, resendJudgeInvite, contestName, t]
  )

  const handleRevoke = useCallback(
    async (judge) => {
      if (!judge || !contestId || !judge.inviteId) return

      const confirmed = window.confirm(
        t("manageInvitations.revokeConfirm", { name: judge.judgeName })
      )

      if (!confirmed) return

      try {
        await revokeJudgeInvite({
          contestId,
          inviteId: judge.inviteId,
        }).unwrap()

        toast.success(
          t("manageInvitations.inviteRevokedSuccess", { name: judge.judgeName })
        )
      } catch (error) {
        console.error("Failed to revoke invite:", error)
        toast.error(
          t("manageInvitations.inviteRevokeError", { name: judge.judgeName })
        )
      }
    },
    [contestId, revokeJudgeInvite, t]
  )

  const columns = getJudgeInviteColumns({
    onInvite: handleInvite,
    onResend: handleResend,
    onRevoke: handleRevoke,
    t,
  })

  return (
    <div>
      <TableFluent data={judges} columns={columns} />

      <TablePagination pagination={pagination} onPageChange={setPageNumber} />
    </div>
  )
}

export default ManageJudgeInvitations
