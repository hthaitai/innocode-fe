import React, { useState, useCallback, useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "../../../services/contestApi"
import {
  useGetJudgesToInviteQuery,
  useResendJudgeInviteMutation,
} from "../../../services/contestJudgeApi"
import { useModal } from "@/shared/hooks/useModal"
import { getJudgeInviteColumns } from "../columns/judgeInviteColumns"
import { sendJudgeInviteEmail } from "@/shared/services/emailService"
import { toast } from "react-hot-toast"

const ContestJudgesPage = () => {
  const { contestId } = useParams()
  const [page, setPage] = useState(1)
  const pageSize = 10
  const { openModal } = useModal()

  const {
    data: contest,
    isLoading: isContestLoading,
    isError: isContestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: judgesData,
    isLoading: isJudgesLoading,
    isError: isJudgesError,
  } = useGetJudgesToInviteQuery({ contestId, page, pageSize })

  const [resendJudgeInvite, { isLoading: isResending }] =
    useResendJudgeInviteMutation()

  const judges = judgesData?.data || []
  const pagination = judgesData?.additionalData || {}

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_JUDGES(
    contest?.name ?? "Contest Judges"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CONTEST_JUDGES(contestId)

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

  // Placeholders for future functionality
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
        const contestName = payload.contestName || contest?.name || "Contest"
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

        const baseUrl = window.location.origin
        const acceptUrl = `${baseUrl}/judge/accept?inviteCode=${inviteCode}`
        const declineUrl = `${baseUrl}/judge/decline?inviteCode=${inviteCode}`

        const emailed = await sendJudgeInviteEmail({
          judgeEmail,
          judgeName,
          contestName,
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
    [contestId, resendJudgeInvite, contest?.name]
  )

  const handleRevoke = useCallback((judge) => {
    toast("Revoke invite will be available soon", { icon: "🛑" })
    console.debug("Revoke invite requested for judge", judge)
  }, [])

  const columns = useMemo(
    () =>
      getJudgeInviteColumns({
        onInvite: handleInvite,
        onResend: handleResend,
        onRevoke: handleRevoke,
      }),
    [handleInvite, handleResend, handleRevoke]
  )

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isContestLoading || isJudgesLoading}
      error={isContestError || isJudgesError}
    >
      <div>
        <TableFluent
          data={judges}
          columns={columns}
          loading={isJudgesLoading}
          error={isJudgesError}
          pagination={pagination}
          onPageChange={setPage}
          renderActions={() => (
            <div className="flex items-center justify-between px-5 min-h-[70px]">
              <div className="text-sm leading-5 font-medium">Judges list</div>
            </div>
          )}
        />
      </div>
    </PageContainer>
  )
}

export default ContestJudgesPage
